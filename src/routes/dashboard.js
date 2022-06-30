import { Router } from "express";

import { getJSON } from "../utils/fetch.js";
import { formatDate, formatTimeSince } from "../utils/formatDate.js";

import { HOST } from "../config.js";

const router = new Router();

router.post('/dashboard', (req, res) => {
    const pulls = JSON.parse(req.body.data);
    res.render('dashboard', { pulls: pulls });
})

router.get('/dashboard/data', async (req, res) => {
    const repos = await getJSON(req.user.profile._json.repos_url, req.user.token);
    const activePulls = [];

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    });

    for (const [i, repo] of repos.entries()) {
        const chunk = `${i + 1} / ${repos.length}`;
        res.write(chunk + '#delimiter#\r\n');

        const pulls = await getJSON(`https://api.github.com/repos/${repo.full_name}/pulls`, req.user.token);
        for (const pull of pulls) {
            // Proceed if pull request can NOT merge
            const status = await getJSON(`https://api.github.com/repos/${repo.full_name}/commits/${pull.head.ref}/status`, req.user.token);
            if (status.state === 'success') continue;

            // Proceed if 'visual_test' IS a required check
            const requiredChecks = await getJSON(`https://api.github.com/repos/${repo.full_name}/branches/${pull.base.ref}/protection/required_status_checks/contexts`, req.user.token);
            if (!Array.isArray(requiredChecks) || !requiredChecks.includes('visual_test')) continue;
            
            // Proceed if the state of 'visual_test' has NOT been set
            const statuses = await getJSON(`https://api.github.com/repos/${repo.full_name}/commits/${pull.head.ref}/statuses`, req.user.token);
            if (statuses.find(status => status.context === 'visual_test')) continue;

            // Push object to pull request array
            activePulls.push({
                repo: {
                    name: repo.name,
                    fullName: repo.full_name,
                    defaultBranch: repo.default_branch,
                },
                loadingUrl: HOST + `loading?url=${encodeURIComponent(HOST + 'tests/' + repo.full_name + '/' + pull.head.ref + '/' + pull.number)}&message=Scanning+files+in+pull+request`,
                title: pull.title,
                number: pull.number,
                createdAt: formatDate(pull.created_at),
                updatedAt: formatTimeSince(pull.updated_at),
                head: {
                    ref: pull.head.ref,
                    sha: pull.head.sha
                },
                base: {
                    ref: pull.base.ref,
                    sha: pull.base.sha
                },
                state: status.state
            })
        }
    }

    // console.log(activePulls);

    res.write(JSON.stringify(activePulls));
    res.end();
})

export default router;