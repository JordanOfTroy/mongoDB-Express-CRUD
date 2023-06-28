const cButt = document.getElementById('createButt')
const rButt = document.getElementById('readButt')
const uButt = document.getElementById('updateButt')
const dButt = document.getElementById('deleteButt')

cButt.addEventListener('click', () => {
    let cInput = document.getElementById('create')
    fetch('/newUser', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cInput.value,
            role: 'n/a',
            age: 30
          })
    })
})

rButt.addEventListener('click', () => {
    
})

uButt.addEventListener('click', () => {
    
})

dButt.addEventListener('click', () => {
    
})

