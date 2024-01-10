document.addEventListener("deviceready", function () {
    loadContactsFromStorage();
    loadContacts();
});

let contacts = [];

function generateContactId() {
    return new Date().getTime();
}

function loadContactsFromStorage() {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
        const storedArray = JSON.parse(storedContacts);
        contacts = contacts.concat(storedArray);
    }
}

function saveContactsToStorage() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function loadContacts() {
    const options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;
    const fields = ['name', 'phoneNumbers'];
    navigator.contacts.find(fields, showContacts, handleContactError, options);
}

function showContacts(contactList) {
    contacts = contactList;
    const contactListView = document.getElementById('contactList');

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const contactId = contact.id; 

        const contactItem = document.createElement('li');
        contactItem.innerHTML = `
            <a href="#contact-details" data-contact-id="${contactId}">
                <img src="img/cnt.png">
                <h1>${contact.name.formatted}</h1>
                <p>${contact.phoneNumbers[0]?.value || 'Non renseigné'}</p>
            </a>
        `;
        contactItem.addEventListener('click', function () {
            showContactDetails(contactId);
        });

        contactListView.appendChild(contactItem);
    }

    $(contactListView).listview('refresh');
    
    console.log('Liste des contacts mise à jour :', contacts);
}




function showContactDetails(contactId) {
    const contactDetailsList = document.getElementById('contactDetailsList');
    contactDetailsList.innerHTML = '';
    const editButton = document.getElementById('editContactButton');
    editButton.setAttribute('data-contact-id', contactId);
    const selectedContact = contacts.find(contact => contact.id == contactId);

    if (selectedContact) {
        let contactDetailsItem;

        contactDetailsItem = document.createElement('li');
        contactDetailsItem.innerHTML = `
            <h2>Nom du contact</h2>
            <p>${selectedContact.name.formatted || 'Non renseigné'}</p>
        `;
        contactDetailsList.appendChild(contactDetailsItem);

        contactDetailsItem = document.createElement('li');
        contactDetailsItem.innerHTML = `
            <h2>Téléphone</h2>
            <p>${selectedContact.phoneNumbers[0]?.value || 'Non renseigné'}</p>
        `;
        contactDetailsList.appendChild(contactDetailsItem);

        if (selectedContact.emails && selectedContact.emails.length > 0) {
            contactDetailsItem = document.createElement('li');
            contactDetailsItem.innerHTML = `
                <h2>Adresse e-mail</h2>
                <p>${selectedContact.emails[0]?.value || 'Non renseigné'}</p>
            `;
            contactDetailsList.appendChild(contactDetailsItem);
        } else {
            contactDetailsItem = document.createElement('li');
            contactDetailsItem.innerHTML = `
                <h2>Adresse e-mail</h2>
                <p>Non renseigné</p>
            `;
            contactDetailsList.appendChild(contactDetailsItem);
        }

        if (selectedContact.organizations && selectedContact.organizations.length > 0) {
            contactDetailsItem = document.createElement('li');
            contactDetailsItem.innerHTML = `
                <h2>Organisation</h2>
                <p>${selectedContact.organizations[0]?.name || 'Non renseigné'}</p>
            `;
            contactDetailsList.appendChild(contactDetailsItem);
        } else {
            contactDetailsItem = document.createElement('li');
            contactDetailsItem.innerHTML = `
                <h2>Organisation</h2>
                <p>Non renseigné</p>
            `;
            contactDetailsList.appendChild(contactDetailsItem);
        }
    }

            $(contactDetailsList).listview('refresh');

}

function handleContactError(error) {
    console.error("Erreur lors de la récupération de la liste des contacts");
    console.error(error);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addContact').addEventListener('click', function () {
        document.getElementById('addContactForm').style.display = 'block';
    });

    document.getElementById('addContactForm').addEventListener('submit', function (event) {
        event.preventDefault();

        let contactName = document.getElementById('contactName').value;
        let contactPhoneNumber = document.getElementById('contactPhoneNumber').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactOrganization = document.getElementById('contactOrganization').value;

        let newContact = {
            id: generateContactId(),
            name: { formatted: contactName },
            phoneNumbers: [{ value: contactPhoneNumber }],
            emails: [{ value: contactEmail }],
            organizations: [{ name: contactOrganization }]
        };

        contacts.push(newContact);
        saveContactsToStorage();
        document.getElementById('addContactForm').style.display = 'none';
        showContacts(contacts);
        alert('Contact ajouté avec succès!');
    });

    $(document).on('pagecreate', '#contact-details', function () {
        $('#contact-details').on('click', '.edit-contact-button', function () {
            let selectedContactId = $(this).data('contact-id');
            console.log('Edit button clicked for contact ID:', selectedContactId);
            showEditContactForm(selectedContactId);
        });

        $(document).on('submit', '#editContactForm', function (event) {
            event.preventDefault();

            let selectedContactId = $('#editContactForm').data('contact-id');
            let selectedContactIndex = contacts.findIndex(contact => contact.id == selectedContactId);

            contacts[selectedContactIndex].name.formatted = $('#editContactName').val();
            contacts[selectedContactIndex].phoneNumbers[0].value = $('#editContactPhoneNumber').val();
            contacts[selectedContactIndex].emails[0].value = $('#editContactEmail').val();
            contacts[selectedContactIndex].organizations[0].name = $('#editContactOrganization').val();

            saveContactsToStorage();
    
            showContacts(contacts);
        
            $.mobile.navigate('#contact-details');
            showContactDetails(selectedContactId);
        
            alert('Contact modifié avec succès!');
        });

        $('#contact-details').on('click', '#deleteContactButton', function () {
            let selectedContactId = $(this).closest('li').data('contact-id');
            console.log('Delete button clicked for contact ID:', selectedContactId);
            deleteContact(selectedContactId);
        });
    });

});

function showEditContactForm(contactId) {
    let selectedContactId = parseInt(contactId);
    let selectedContact = contacts.find(contact => contact.id === selectedContactId);

    if (selectedContact) {
        $('#editContactName').val(selectedContact.name.formatted || '');
        $('#editContactPhoneNumber').val(selectedContact.phoneNumbers[0]?.value || '');
        $('#editContactEmail').val(selectedContact.emails[0]?.value || '');
        $('#editContactOrganization').val(selectedContact.organizations[0]?.name || '');

        $('#editContactForm').data('contact-id', selectedContactId);

        $('#editContactForm').trigger('create');

        $.mobile.navigate('#editContactPage');
    } else {
        console.error('Le contact sélectionné est undefined. Contacts:', contacts);
    }
}


function deleteContact(contactId) {
    if (confirm('Voulez-vous vraiment supprimer ce contact?')) {
        let selectedContactIndex = contacts.findIndex(contact => contact.id == contactId);

        if (selectedContactIndex !== -1) {
            contacts.splice(selectedContactIndex, 1);
            saveContactsToStorage();
            showContacts(contacts);
            $.mobile.navigate('#contact-list');

            alert('Contact supprimé avec succès!');
        } else {
            console.error('Le contact sélectionné est undefined.');
        }
    }
}
