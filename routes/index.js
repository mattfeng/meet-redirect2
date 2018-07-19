const sqlite = require('sqlite')
const express = require('express')
const sha256 = require('sha256')
const express = require('express')
const router = express.Router()

const dbPromise = sqlite.open('./db/shortcuts.db', { Promise })

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', {
    title: 'MEET Redirect'
  })
})


router.use((req, res, next) => {
  let password = req.body.password;
  const secret = '8da01678031fde4d8a24d06192b674fad47d8e4874938493e7add38b29ac3b29'
  if (password && sha256.x2(password) === secret) {
    next()
  } else {
    res.status(403);
    res.json({
      success: false,
      message: "You don't have permission to do this."
    });
  }
});

router.post('/new', async (req, res) => {
  let nick = req.body.nick
  let url = req.body.url

  if (!nick || !url) {
    res.json({
      success: false,
      message: 'nick and url not provided.'
    })
  }

  try {
    const db = await dbPromise
    await db.run("INSERT INTO shortcuts VALUES (?, ?)", [nick, url])

    res.json({
      success: true,
      message: 'Shortcut added.'
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
}) 

module.exports = router
