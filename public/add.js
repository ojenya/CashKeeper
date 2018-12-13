function submitNewCost() {
$.post({
        url: '/add',            
        dataType : "json",   
        data: {cat: $('#category').val(),sum: $('#sum').val(),date: $('#date').val(),comment: $('#comment').val()},               
        success: function (data) { // вешаем свой обработчик на функцию success
          //  $.each(data, function(i, val) {    // обрабатываем полученные данные
                //console.log(data);
                console.log(data);
                
           // });
        } 
    });
}
