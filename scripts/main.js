const API_BASE = 'https://www.reddit.com'
const API_URL = `${API_BASE}/r/anime/comments/af4unw/crunchyroll_guest_pass_thread.json?limit=50&&jsonp`
/**
 *
 * @todos :
 *  1. Bisa custom jumlah card yang di load
 *  2. Button untuk refetch biar ngga usah reload
 *  3. Add backend? mungkin?
 */

/**
 * Get post/thread data
 * @param {string} url api url
 */
const getPost = async function (url) {
  const promise = await axios.get(`${url}`)

  return promise.data
}

const getGuestPass = async function () {
  const data = await getPost(API_URL)

  return data.map(group => {
    const passList = []
    group.data.children.map(child => {
      const { body_html, author, permalink, score, created_utc: posted } = child.data
      if (!child.data.body_html) return

      const passArr = child.data.body_html.match(/[A-Z0-9]{6,}/g)
      passArr && passArr.forEach(pass => passList.push({ author, permalink, pass, posted }))
    })

    return passList
  })
}

/**
 * Render to the dom
 */
const renderPass = async function (callback) {
  const data = await getGuestPass()

  const app = document.querySelector('#app')

  data[1].forEach((obj, index) => {
    console.log(obj.permalink)
    const wrapper = document.createElement('div')
    wrapper.className = 'guess-pass'
    wrapper.innerHTML = `
      <input type="text" class="pass" id="${obj.pass + index}"
        value="${obj.pass}" />
      <div class="author">
        by <a href="http://reddit.com/${obj.permalink}">${obj.author}</a>
      </div>
      <div class="posted">
        Posted on ${moment(obj.posted*1000).startOf('hour').fromNow()}
      </div>
    `
    app.appendChild(wrapper)
  })

  callback()
}

/**
 * Select inner text
 * @param {string} containerId id of container
 */
const selectText = function (containerId) {
  if (document.selection) { // IE
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(containerId));
      range.select();
  } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(document.getElementById(containerId));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
  }
}

const showToolTip = function (parent) {
  if (parent.querySelector('.tooltip')) return

  const { x, y, right, top } = parent.getBoundingClientRect()

  const tooltip = document.createElement('span')
  tooltip.className = 'tooltip'
  tooltip.innerHTML = 'Pass copied!'
  parent.parentNode.appendChild(tooltip)

  setTimeout(function () {
    tooltip.remove()
  }, 500)
}


/**
 * Document ready helper
 * @param {function} fn callback function
 */
const ready = function (fn) {
  if (typeof fn !== 'function') return

  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'interactive') {
      removeEventListener('onreadystatechange', this)
      return fn()
    }
  }, false)

  document.addEventListener('DOMContentLoaded', fn, false)
}

ready(function () {
  renderPass(function () {
    const spinner = document.querySelector('#spinner')
    spinner && spinner.classList.add('loaded')
  })

  // Listen to every click and copy thex text content
  document.addEventListener('click', function (event) {
    if (event.target.className !== 'pass') return

    event.target.select()
    document.execCommand('copy')

    // show tooltip
    showToolTip(event.target)
  })
})