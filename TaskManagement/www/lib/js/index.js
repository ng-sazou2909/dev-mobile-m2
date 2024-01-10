$(document).ready(function() {
    var tache = $("#tache");
    var ajouter = $("#ajouter");
    var reinitialiser = $("#reinitialiser");
    var encours = $("#encours");
    var enteteEncours = $("#enteteEncours");
    var tachesEncours = $("#tachesEncours");
    reinitialiserListe();

    ajouter.on("click", ajouterTache);
    reinitialiser.on("click", reinitialiserListe);

    function ajouterTache() {
        if (tache.val() !== '') {
            $(encours).html('Encours');
            $(encours).css('color', 'white');
            $(tachesEncours).append('<li>' + tache.val() + '</li>');
        }
        tache.val('');
        tache.focus();
        tachesEncours.listview("refresh");
    }

    function reinitialiserListe() {
        $(encours).html('Aucune encours');
        $(tachesEncours).empty();
        $(terminee).html('Aucune terminée');
        $(tachesTerminee).empty();
        $(tachesEncours).listview("refresh");
        $(tachesTerminee).listview("refresh");
        $(encours).css('color', 'red');
        $(terminee).css('color', 'red');
        $(tache).focus();
    }
    $("#tachesEncours").on("swiperight", "li", function(event) {
            var itemText = $(event.target).text();
            $("#tachesTerminee").append('<li>' + itemText + '</li>');
            $(terminee).html('Terminée');
            $(terminee).css('color', 'white');
            $(event.target).remove(); // Supprimer l'élément de la liste encours
            $(encours).html('Encours');
            if ($("#tachesEncours li").length === 0) {
                $(encours).html('Aucune encours');
                $(encours).css('color', 'red');
            }
            $(tachesEncours).listview("refresh");
            $("#tachesTerminee").listview("refresh");
        });
    $("#tachesTerminee").on("swiperight", "li", function(event) {
                var itemText = $(event.target).text();
                $("#tachesEncours").append('<li>' + itemText + '</li>');
                $(encours).html('Encours');
                $(encours).css('color', 'white');
                $(event.target).remove(); // Supprimer l'élément de la taches Terminee
                $(terminee).html('Terminées');
                if ($("#tachesTerminee li").length === 0) {
                   $(terminee).html('Aucune terminée');
                   $(terminee).css('color', 'red');
                  }
                $(tachesEncours).listview("refresh");
                $(tachesTerminee).listview("refresh");

            });

    $("#tachesEncours").on("swipeleft", "li", function(event) {
            $(event.target).remove(); // Supprimer l'élément de la liste encours
            if ($("#tachesEncours li").length === 0) {
               $(encours).html('Aucune encours');
               $(encours).css('color', 'red');
             }
            tachesEncours.listview("refresh");
        });

    $("#tachesTerminee").on("swipeleft", "li", function(event) {
                    $(event.target).remove(); // Supprimer l'élément de la liste taches Terminee
                    if ($("#tachesTerminee li").length === 0) {
                     $(terminee).html('Aucune terminée');
                     $(terminee).css('color', 'red');
                     }
                    tachesTerminee.listview("refresh");
        });

   }
   );