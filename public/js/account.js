function confirmDelete() {
    const confirmation = confirm("You are about to delete an account. Click 'Continue' to proceed or 'Cancel' to go back.");
    if (confirmation) {
      document.getElementById('delete-account-form').submit();
    }
  }