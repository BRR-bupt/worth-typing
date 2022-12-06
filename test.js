const test = '“111”'
function handleQuote(val) {
  return val.replace(/“/g, '"').replace(/”/g, '"')
}
console.log(handleQuote(test))

