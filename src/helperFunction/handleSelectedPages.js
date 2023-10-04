function handleSelectedPages(checked,selectedPage,currentPage,setSelectedPage){
    const isChecked = checked
    let updatedSelectedPages
    if(isChecked)  updatedSelectedPages = [...selectedPage, currentPage];
    else{
      let index = selectedPage.indexOf(currentPage)
      updatedSelectedPages = [...selectedPage]
      updatedSelectedPages.splice(index, 1)
  
    }
    updatedSelectedPages = !updatedSelectedPages?.length?[]:updatedSelectedPages
  
  setSelectedPage(updatedSelectedPages); // Update the state
  }

  export default handleSelectedPages