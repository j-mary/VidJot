// Search
const search = document.querySelector('.search').addEventListener('input', (e) => {
  const ideas = document.querySelectorAll('h4').filter(item => {
    if (item.textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
      item.style.display = 'block'
    } else {
      item.style.display = 'none'
    }
  })
})
