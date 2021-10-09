//Storagecont

const StorageCont = (function(){

    return {
        Retirer : function(){
            let items = [];
            if(localStorage.getItem("items") != null){
              items = JSON.parse(localStorage.getItem("items"));
              return items;
            }
            return [];
        },

        AjouteAulocalStrg : function(item){
            let items ;

            if( localStorage.getItem("items") === null){
                items= [];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
            else{
                items = JSON.parse( localStorage.getItem('items') );
                // console.log(items);
                items.push(item);
                // console.log(items);
                localStorage.setItem('items',JSON.stringify(items));
            }
           
        },
        modifierStorage : function(item,id){
            let items ;
                
            items = JSON.parse( localStorage.getItem('items') );
                // console.log(items);
            items[id]=item;
                // console.log(items);
            localStorage.setItem('items',JSON.stringify(items));
            
        },

        suppDeStorage : function(id){
            let items=[] ,Items=[];
                
            items = JSON.parse( localStorage.getItem('items') );
             
           Items = items.filter(function(val){
                return val.id != id ; 
           });

            localStorage.setItem('items',JSON.stringify(Items));
            
        },
       viderStorage : function(){
            let items=[];
            localStorage.setItem('items',JSON.stringify(items));
        }

    }
})();

// ItemContolller 
  
const ItemCont=(function(){

    const Item = function(ID,Nom,calories){
        this.id= ID;
        this.name =Nom;
        this.calories = calories;
    }

    const data = {
        items : [
            // {id:0,name : 'A',calories : 221}
        ],
        cuttentItem : null,
        totalCalories : 0
    }


    return {
        affData : function(){
            return data;
        },
        affitems : function(){
            return data.items ;
        } ,
        addItem : function(input){
            let id,item ;
            if(data.items.length !== 0){
                 id = data.items[data.items.length -1].id+1;
            }
            else{
                id= 0;
            }
            item =new Item(id,input.name,parseInt(input.calories));
            data.items.push(item);
            return item;
        },
        calCalories : function(items){
            let s=0;

                items.forEach(
                    function(obj){
                        s+= obj.calories;
                    }
                );
                data.totalCalories =s;
                return s;
        },
        affTotalCalories : function(){
            return data.totalCalories;
        } ,
        // modifierPlat : function(id){
            
        // }
       PlatActuelle : function(id){
           let curr=null;
           data.items.forEach(function(item){
                if(item.id === id){
                   curr = item;
                }
            })
            data.cuttentItem = curr;
            
       },
       modifLastructure : function(name,calories){
           let item =new Item(data.cuttentItem.id,name,calories);
                data.items[data.cuttentItem.id] = item;
                return item ;
       },

       suppDeStructure : function(){
           if(data.cuttentItem !== null){
            let ndata = [];    
              ndata = data.items.filter(function(items){
                    return items.id != data.cuttentItem.id;
                });
                data.items = ndata;
           }
        },

        viderLaStructure : function(){
            data.items = [];
            data.totalCalories = 0;
            data.cuttentItem = null;
        },

        setItems :function(items){
            data.items = items;
        }
  };
})();


// UIController
 
const Uicont = (function(){


    return {

        initUi :  function(items){
            let cont ='';
          items.forEach( item => {
            cont += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}</em>
                <a href="#" class="secondary-content">
                  <i class="editer fa fa-pencil"></i>
                </a>
              </li>`;
            
            } );
            document.getElementById('item-list').innerHTML = cont;
        },

        getInput : function(){

         return {
            name : document.getElementById('item-name').value,

            calories :document.getElementById('item-calories').value
         }

        },
        addItem : function(item) {
            const li = document.createElement('li');
            li.className ="collection-item";
            li.setAttribute('id',`item-${item.id}`);
    
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="editer fa fa-pencil"></i>
            </a>`;

            document.getElementById('item-list').appendChild(li);
        },
        clear : function(){
            document.getElementById('item-name').value='';
            document.getElementById('item-calories').value='';
        },
        AddCalories : function(s){
            document.querySelector('.total-calories').innerHTML =s; 
        },
        masquerBtn : function() {
          document.querySelector('.update-btn').style.display = 'none';

          document.querySelector('.delete-btn').style.display = 'none';

          document.querySelector('.back-btn').style.display = 'none';
          document.querySelector('.add-btn').style.display =  'inline';
        },

        affBoutton : function(){
            document.querySelector('.add-btn').style.display =  'none';

            document.querySelector('.update-btn').style.display = 'inline';

            document.querySelector('.delete-btn').style.display =  'inline';
  
            document.querySelector('.back-btn').style.display =  'inline';
        },

        midifierElement : function(name,cal,id){
                document.getElementById(`item-${id}`).querySelector('strong').innerHTML = name+':';

                document.getElementById(`item-${id}`).querySelector('em').innerHTML = cal;
                Uicont.masquerBtn();
                Uicont.clear();
        },

        insererPlatAcuelle : function(item){
            document.getElementById('item-name').value=item.name;
            document.getElementById('item-calories').value=item.calories;
        },

        suppdeUI : function(id){
         document.getElementById('item-list').removeChild(document.getElementById(`item-${id}`));
            Uicont.clear();
            Uicont.masquerBtn();

        },

        viderLaListe : function(){
            document.getElementById('item-list').innerHTML ='';
            Uicont.clear();
            Uicont.masquerBtn();
            Uicont.AddCalories(0);
        }
    }
           
})();



//AppController 
const  AppContr = (function(ItemCont,Uicont,StorageCont){

  const eventList = function (){

     document.querySelector('.add-btn').addEventListener('click', addData);

     document.querySelector('#item-list').addEventListener('click', etatdeModification);
 
     document.querySelector('.update-btn').addEventListener('click',modifierPlatActuelle);


     document.querySelector('.back-btn').addEventListener('click',EtatdeRetour);


     document.querySelector('.delete-btn').addEventListener('click',supprimerElement);

     document.querySelector('.clear-btn').addEventListener('click',viderTous);

   }

   const viderTous = function(e){
        ItemCont.viderLaStructure();
        Uicont.viderLaListe();
        StorageCont.viderStorage();
   }

    const addData = function(e) {
        e.preventDefault() ;
        const input= Uicont.getInput();
        
      if(input.name !== "" && input.calories !== ""){
         // add to data 
            const item = ItemCont.addItem(input);
        // Ajouter au local storage
            StorageCont.AjouteAulocalStrg(item);

        //
            Uicont.addItem(item);
            Uicont.clear();

           let cal= ItemCont.calCalories(ItemCont.affitems());
           //    console.log(cal);
             Uicont.AddCalories(cal);
            //  console.log( ItemCont.affTotalCalories()) ;
        }
        else{
            alert('Entrez tous les champs');
        }
    }

    const etatdeModification = function(e){
    //  console.log(e.target.parentNode.parentNode.classList);
        if(e.target.classList.contains("editer")){
             Uicont.affBoutton();
        
            let id = e.target.parentNode.parentNode.id.split("-")[1];
                id = parseInt(id);

                ItemCont.PlatActuelle(id);
                Uicont.insererPlatAcuelle(ItemCont.affData().cuttentItem);
                // console.log(id); 
        }
    }
    
    const modifierPlatActuelle = function(e){
       const inp = Uicont.getInput();
    //    console.log(inp);
       const Nitem = ItemCont.modifLastructure(inp.name,parseInt(inp.calories));
          Uicont.midifierElement(inp.name,inp.calories, ItemCont.affData().cuttentItem.id);
          StorageCont.modifierStorage(Nitem,ItemCont.affData().cuttentItem.id);

    //    Uicont.modifierPlatListe(inp);
    //    Uicont.clear();

        Uicont.AddCalories(ItemCont.calCalories(ItemCont.affitems()));
        e.preventDefault();
    }

    const EtatdeRetour = function(e){
      
        Uicont.masquerBtn();  
        Uicont.clear();
        e.preventDefault();
    }

    const supprimerElement = function(e){ 

        Uicont.suppdeUI(ItemCont.affData().cuttentItem.id);  

        StorageCont.suppDeStorage(ItemCont.affData().cuttentItem.id);  
             
        ItemCont.suppDeStructure();
        
        Uicont.AddCalories(ItemCont.calCalories(ItemCont.affitems()));

        e.preventDefault();
    }

     return {
        init : function(){

        //Masquer les bottons 
         Uicont.masquerBtn();

        //Retirer les elements de la localstorage
          const items = StorageCont.Retirer();
        // //   console.log(items);
          ItemCont.setItems(items);

        // afficher les elements de structures de données
          Uicont.initUi(ItemCont.affitems());

          eventList();
        
          // Calculer et afficher les calories des plats
          let calories= ItemCont.calCalories(ItemCont.affitems());
        //   console.log(calories);

          Uicont.AddCalories(calories);


        } 
    }

})(ItemCont,Uicont,StorageCont);
 

AppContr.init();

