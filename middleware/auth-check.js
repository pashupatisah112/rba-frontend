export default function (context) {
  if (context.$auth.$state.loggedIn) {
    var role = context.$auth.$state.user.role.role;
    if (role == "Admin") {
      context.redirect("/admin");
    } else if (role == "Manager") {
      context.redirect("/manager");
    } else if (role == "Engineer") {
      context.redirect("/engineer");
    } else {
      context.redirect("/");
    }
  } else {
    context.redirect("/");
  }
}
