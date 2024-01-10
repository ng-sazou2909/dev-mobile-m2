function claculerAge(){
const anneeCourante = new Date().getFullYear();
let info = +naissance.value
if(info!=0 && info<anneeCourante){
    let age = anneeCourante-naissance.value;
    resultat.innerHTML = 'Vous avez '+age+' ans !';
    resultat.style.color = 'blue';
    }else{
        resultat.innerHTML = 'Veuillez renseigner une date de naissance !';
        resultat.style.color = 'red';
    }
}