function create (workItems) {
  workItems = workItems || []

  function add (workItem) {
    workItems.push(workItem)
  }

  function all (res, req, next) {
    work(res, req, next, 0)
  }

  function work (res, req, next, i) {
    var workItem = workItems[i]
    var itemType = typeof workItem
    if (itemType === 'function') {
      workItem(res, req, function () {
        work(res, req, next, i + 1)
      })
    } else if (i < workItems.length) {
      console.log(`Preflight middleware at ${i} was not a function: ${itemType}`)
    } else {
      next()
    }
  }

  return {
    add,
    all
  }
}

module.exports = create
