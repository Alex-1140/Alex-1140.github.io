const dishes = [
    //Супы
    {
        keyword: "borscht",
        name: "Борщ",
        price: 150,
        category: "soup",
        count: "300 гр.",
        image: "../Images/борщ.jpg",
        kind:"meat"
    },
   /* {
        keyword: "lagman",
        name: "Лагман",
        price: 250,
        category: "soup", 
        count: "450 гр.",
        image: "../Images/лагман.jpg",
        kind:"meat"
    },*/
    {
        keyword: "solyanka",
        name: "Солянка",
        price: 300,
        category: "soup",
        count: "250 гр.",
        image: "../Images/солянка.jpg",
        kind:"meat"
    },
    {
        keyword: "green_borscht",
        name: "Зеленый борщ со щавелем и яйцом",
        price: 300,
        category: "soup",
        count: "250 гр.",
        image: "../Images/зеленый борщ.jpg",
        kind:"veg"
    },
    {
        keyword: "buiabes",
        name: "Буйабес",
        price: 300,
        category: "soup",
        count: "250 гр.",
        image: "../Images/Буйабес.webp",
        kind:"fish"
    },

    {
        keyword: "potahe",
        name: "Потахе",
        price: 300,
        category: "soup",
        count: "350 гр.",
        image: "../Images/потахе.jpg",
        kind:"veg"
    },

    {
        keyword: "fish_soup",
        name: "Уха царская",
        price: 350,
        category: "soup",
        count: "300 гр.",
        image: "../Images/уха.jpg",
        kind: "fish"
    },


    //Главные блюда

    {
        keyword: "potato_village",
        name: "Картофель по-деревенки с мясом",
        price: 150,
        category: "main",
        count: "300 гр.",
        image: "../Images/картофель по-деревенки с мясом.webp",
        kind:"meat"
    },

    {
        keyword: "puree_cutlet",
        name: "Пюрэ с рыбной котлетой",
        price: 250,
        category: "main",
        count: "450 гр.",
        image: "../Images/пюре с рыбной котлетой.jpg",
         kind:"fish"
    },
    {
        keyword: "pasta primavera",
        name: "Паста примавера",
        price: 300,
        category: "main",
        count: "250 гр.",
        image: "../Images/паста примавера.webp",
        kind:"veg"
    },
    {
        keyword: "dumplings",
        name: "Пельмени",
        price: 300,
        category: "main",
        count: "250 гр.",
        image: "../Images/пельмени.webp",
        kind:"meat"
    },
{
        keyword: "pasta ogure",
        name: "Паста из цукини под соусом из огурца и авокадо",
        price: 300,
        category: "main",
        count: "250 гр.",
        image: "../Images/Паста из цукини под соусом из огурца и авокадо.jpg",
        kind:"veg"
    },


{
    keyword: "forel",
    name: "Стейк из форели с овощами",
    price: 400,
    category: "main",
    count: "450 гр.",
    image: "../Images/Стейк из форели с овощами.jpg",
     kind:"fish"
},

    //Напитки
    {
        keyword: "americano",
        name: "Американо",
        price: 150,
        category: "drink",
        count: "300 гр.",
        image: "../Images/американо.jpg",
        kind:"hot"
    },
    {
        keyword: "green_tea",
        name: "Чай зеленый",
        price: 300,
        category: "drink",
        count: "250 гр.",
        image: "../Images/Чай зеленый.jpg",
        kind:"hot"
    },
    {
        keyword: "black_tea",
        name: "Чай черный",
        price: 300,
        category: "drink",
        count: "250 гр.",
        image: "../Images/Чай черный.jpg",
        kind:"hot"
    },
    {
        keyword: "latte",
        name: "Латте",
        price: 300,
        category: "drink",
        count: "250 гр.",
        image: "../Images/Латте.webp",
        kind:"cold"
    },
    {
        keyword: "tarragon",
        name: "Тархун",
        price: 300,
        category: "drink",
        count: "250 гр.",
        image: "../Images/тархун.jpg",
        kind:"cold"
    },
    {
        keyword: "hibiscus",
        name: "Каркаде",
        price: 300,
        category: "drink",
        count: "250 гр.",
        image: "../Images/каркаде.jpg",
        kind:"cold"
    },



    //Салат или стартер

    {
        keyword: "grek",
        name: "Греческий салат",
        price: 300,
        category: "salat",
        count: "250 гр.",
        image: "../Images/салат греческий.jpg",
        kind:"veg"
    },
    {
        keyword: "leto",
        name: "Салат летний",
        price: 300,
        category: "salat",
        count: "250 гр.",
        image: "../Images/салат летний.jpg",
        kind:"veg"
    },
    {
        keyword: "mimoza",
        name: "Салат мимоза",
        price: 300,
        category: "salat",
        count: "250 гр.",
        image: "../Images/салат мимоза.webp",
        kind:"fish"
    },
    {
        keyword: "olivie",
        name: "Салат оливье",
        price: 300,
        category: "salat",
        count: "250 гр.",
        image: "../Images/салат оливье.jpg",
        kind:"meat"
    },
    {
        keyword: "tabule",
        name: "Салат Табуле",
        price: 300,
        category: "salat",
        count: "250 гр.",
        image: "../Images/салат Табуле.jpg",
        kind:"veg"
    },
    {
        keyword: "achik",
        name: "Аччик-чучук",
        price: 300,
        category: "salat",
        count: "250 гр.",
        image: "../Images/аччик-чучук.webp",
        kind:"veg"
    },



//Десерт

{
        keyword: "mafin",
        name: "Мафин",
        price: 300,
        category: "dessert",
        count: "250 гр.",
        image: "../Images/мафин.jpg",
        kind:"small"
    },

    {
        keyword: "napoleon",
        name: "Наполеон",
        price: 300,
        category: "dessert",
        count: "250 гр.",
        image: "../Images/Наполеон.webp",
        kind:"middle"
    },

    {
        keyword: "blanmange",
        name: "Шоколадное бланманже",
        price: 300,
        category: "dessert",
        count: "250 гр.",
        image: "../Images/Шоколадное бланманже.jpg",
        kind:"small"
    },

    {
        keyword: "krem-brule",
        name: "Крем-брюле",
        price: 300,
        category: "dessert",
        count: "250 гр.",
        image: "../Images/крем-брюле.jpg",
        kind:"small"
    },

    {
        keyword: "tiramisu",
        name: "Тирамису",
        price: 300,
        category: "dessert",
        count: "250 гр.",
        image: "../Images/тирамису.jpeg",
        kind:"middle"
    },

    {
        keyword: "mereng",
        name: "Меренговый рулет",
        price: 300,
        category: "dessert",
        count: "250 гр.",
        image: "../Images/меренговый рулет.jpg",
        kind:"big"
    }


];