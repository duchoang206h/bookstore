axios.defaults.withCredentials = true
$("#cart_btn").on("click", function(event){
    $("#cart_btn").show();
});

async function addToCart(id, amount=1){

   try {
      const result = await axios.put('http://localhost:3000/users/cart', {
         id: id,
         amount: amount
      })
      setTimeout(function(){
         $('#cart_btn').addClass('shake');
         setTimeout(function(){
            $('#cart_btn').removeClass('shake');
         },200)
       },500)
    
   } catch (error) {
      window.location = "/users/login"
    console.log(error)
   }
}