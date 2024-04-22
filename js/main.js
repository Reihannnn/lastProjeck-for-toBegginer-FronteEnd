document.addEventListener("DOMContentLoaded" ,function(){
  const submitForm = document.getElementById("inputBook")
  
  const bookList = []
  const RENDER_EVENT = "render-book"

  // function for add book to the list
  function addBook(){
    const inputBookTitle = document.getElementById("inputBookTitle").value;

    const inputBookAuthor = document.getElementById("inputBookAuthor").value;

    const inputBookYear = document.getElementById("inputBookYear").value;

    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    
    const inputBookImage = document.getElementById("inputBookImage").value

    const checkBoxValue = inputBookIsComplete.checked ? true:false; // agar mengambil nilai value dari chekbox

    const renderID  = renderId(); // generate id

    const bookObject = generateBookObject(renderID,inputBookImage,inputBookTitle,inputBookAuthor,inputBookYear,checkBoxValue)
    

    bookList.push(bookObject)

    document.dispatchEvent(new Event (RENDER_EVENT))
    saveData()
  }

  

  // function generateBookObject
  function generateBookObject(id,image,title,author,year,isCompleted){
    return{
      id,
      image,
      title,
      author,
      year,
      isCompleted
    }
  }


  // submit form EventListener 

  submitForm.addEventListener("submit",function(e){
    e.preventDefault();
    addBook()
    console.log(bookList)
    alert("data telah ditambahkan")
  })


  function renderId(){
    return +new Date()
  }


  // render item item BOOK list
  document.addEventListener(RENDER_EVENT, function(){
    const unCompleteDiv = document.getElementById("incompleteBookshelfList")


    unCompleteDiv.innerHTML = ""

    const completeDiv = document.getElementById("completeBookshelfList")

    completeDiv.innerHTML = " "

    for (const bookItem of bookList) {
      const bookElement = buildBookObject(bookItem)

      if(!bookItem.isCompleted){
        unCompleteDiv.append(bookElement)
      }else{
        completeDiv.append(bookElement)
      }
    }
  })

  
  function buildBookObject(bookObject){
      // make image to add booikList
      const buildImage = document.createElement("img")
      buildImage.classList.add("Image");
      buildImage.setAttribute("src", bookObject.image)

    // make a title from bookList
      const textTItle = document.createElement("h3");
      textTItle.innerText = bookObject.title;

      // make text author from this bookList
      const textAuthor = document.createElement("p");
      textAuthor.innerText = `penulis : ${bookObject.author}`;

      const textYear = document.createElement("P");
      textYear.innerText = `tahun : ${bookObject.year}`

      // make Article Element for HTML structur
      const makeArticle = document.createElement("article")

      makeArticle.classList.add("book-item");
      makeArticle.append(buildImage,textTItle,textAuthor,textYear)

      // kondisi dimana jika buku bersifat true atau false

      if(bookObject.isCompleted == false){
        const divAction = document.createElement("div")
        divAction.classList.add("action")

        // make button selesai
        const buttonSelesai = document.createElement("button")
        buttonSelesai.classList.add("green")
        buttonSelesai.innerText = "selesai dibaca"

        // event button selesai 
        buttonSelesai.addEventListener("click",function(){
          selesaiBaca(bookObject.id)
        })

        // make button Hapus 
        const buttonHapus = document.createElement("button");
        buttonHapus.classList.add("red")
        buttonHapus.innerText = "Hapus buku"

        //event button hapus
        buttonHapus.addEventListener("click",function(){
          hapusBaca(bookObject.id)
        })

        // masukan kedua button kedalam divAction
        divAction.append(buttonSelesai,buttonHapus);

        makeArticle.append(divAction)
      
      } else{
        const divAction = document.createElement("div")
        divAction.classList.add("action")
        
        // make button belum selesai
        const buttonBelumSelesai = document.createElement("button")
        buttonBelumSelesai.classList.add("green");
        buttonBelumSelesai.innerText ="Belum selesai dibaca"

        // Event button belums selesai dibaca
        buttonBelumSelesai.addEventListener("click",function(){
          belumSelesaiBaca(bookObject.id);
        })

        // make button Hapus 
        const buttonHapus = document.createElement("button");
        buttonHapus.classList.add("red")
        buttonHapus.innerText = "Hapus buku"

        //event button hapus
        buttonHapus.addEventListener("click",function(){
          hapusBaca(bookObject.id)
        })

        divAction.append(buttonBelumSelesai,buttonHapus);

        makeArticle.append(divAction)

        
      }

       

      // function button selesai dibaca
      function  selesaiBaca(bookId){
        const bookItemTarget  = findBook(bookId)

        if(bookItemTarget == null) return;
        bookItemTarget.isCompleted  = true ; 

        alert(`buku ${bookObject.title} telah selesai dibaca SELAMAT !!`)
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()

      }

      // function belum selesai dibaca 
      function belumSelesaiBaca(bookId){
        const bookItemTarget = findBook(bookId)
        if (bookItemTarget  == -1 )return
        bookItemTarget.isCompleted = false
        alert(`buku ${bookObject.title} dipindah menjadi belum membaca`)
        document.dispatchEvent(new Event (RENDER_EVENT))
        saveData()
      }

      // function hapus buku
      function hapusBaca(bookId){
        const bookItemTarget  = findBookIndex(bookId);

        if (bookItemTarget  === -1 ) return;

        bookList.splice(bookItemTarget,1)
        alert(`buku ${bookObject.title} telah dihapus`)
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData()
      }

      
      // function mencari bbookList dengan index dari object bookLsit.id

      function findBookIndex (bookId){
        for (const index in bookList) {
          if(bookList[index].id === bookId){
            return index
          }
        }
        return -1
      }

      //function mencari bookList dengan randomId yang terdapat pada object nya

      function findBook(bookId){
        for (const bookItem of bookList) {
          if(bookItem.id == bookId){
            return bookItem
          }
        }
        return null
      } 

      

      //funtion untuk memeriksa apakah browser mendukung webStorage
      

      return makeArticle;
  }

  function isExistStorage(){
    if(typeof (Storage) === undefined){
      alert("browser tidak mendukung WEBSTORAGE !!!")
      return false
    }

    return true
  }


 // inisialisasi variable key webStorage
 const SAVE_DATA = "save_book"
 const STORAGE_KEY = "BOOK_LIST"

 // function saveData ke dalam localStorage :

 function saveData(){
   if(isExistStorage()){
     const parse = JSON.stringify(bookList);
     localStorage.setItem(STORAGE_KEY,parse);
     document.dispatchEvent(new Event(RENDER_EVENT))
     console.log(parse)
   }
 }

 document.addEventListener(SAVE_DATA,function(){
   console.log(localStorage.getItem(STORAGE_KEY))
 })

 // function loaddata bookList
  function loadData(){
    const ambilData = localStorage.getItem(STORAGE_KEY)

    let data = JSON.parse(ambilData)
      if(data !== null){
        for (const item of data) {
          bookList.push(item)
        }
      }
      document.dispatchEvent(new Event(RENDER_EVENT))
  }

  if (isExistStorage()) {
    loadData();
  }
  
  function cariBuku (){
    const value = document.getElementById("searchBookTitle").value.toLowerCase();
    const books = document.querySelectorAll(".book-item")
    books.forEach(book =>{
      const title = book.querySelector("h3").innerText.toLowerCase()

      if(title.includes(value)){
        book.style.display = "block"
      }else{
        book.style.display = "none"
      }
    })
    
  }

  const inputSeachBook = document.getElementById("searchBookTitle")
  inputSeachBook.addEventListener("input",function(e){
    e.preventDefault()
    cariBuku()
    
  }) // event oninput 

  const submitSeachBookButton = document.getElementById("searchSubmit") 

  submitSeachBookButton.addEventListener("click",function(e){
    e.preventDefault()
    cariBuku()
  }) //event onclick
  
    
})


