import { Router } from "express";
import { getJSON } from "../utils/fetch.js";
import { processTree } from "../utils/processTree.js";

const router = new Router();

router.post('/tests/:owner/:repo/:branch/:pullNumber', async (req, res) => {
    const { owner, repo, branch, pullNumber } = req.params;

    const files = JSON.parse(req.body.data);

    res.render('tests', { files: files });
})
router.get('/tests/:owner/:repo/:branch/:pullNumber/data', async (req, res) => {
    const { owner, repo, branch, pullNumber } = req.params;

    const branchContent = await getJSON(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, req.user.token);
    if (branchContent.message) return res.sendStatus(404);

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    });

    const files = await processTree(res, branchContent.tree, req.user.token);

    res.write(JSON.stringify(files));
    res.end()
})

export default router;