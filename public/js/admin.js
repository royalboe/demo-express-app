function deleteProduct(btn) {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');

  fetch('/admin/product/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    // This is to be able to read a readable stream from the response body
    .then(result => {
      return result.json();
    })
    .then(data => {
      console.log(data);
      // productElement.parentNode.removeChild(productElement); use for IE
      productElement.remove();
      // btn.parentNode.parentNode.parentNode.removeChild(btn.parentNode.parentNode);
    })
    .catch(err => {
      console.log(err);
    })
}