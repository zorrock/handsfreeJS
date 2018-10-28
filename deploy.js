const shell = require('shelljs')

// build
shell.exec('npm run build')

// navigate into the build output directory
shell.cd('dist')

// if you are deploying to a custom domain
shell.exec('echo handsfree.js.org > CNAME')

shell.exec('git init')
shell.exec('git add -A')
shell.exec('git commit -m "deploy docs 🐵"')

// if you are deploying to https://<USERNAME>.github.io
// git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

// if you are deploying to https://<USERNAME>.github.io/<REPO>
shell.exec('git remote add origin https://github.com/handsfreejs/docs')
shell.exec('git push origin master:gh-pages -f')

shell.cd('-')
