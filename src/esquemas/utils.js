/*Simplemente toma un error de zod y muestra el primer error de validacion*/
const mostrarZodError = (error) => {
  console.log(error);
  //Si el schema tiene restricciones tipo .or() o .union() muestra ese error
  //ya que no se almacenan donde siempre se tiene que almacenar
  if (error.issues[0].unionErrors) {
    if (error.issues[0].unionErrors[0].issues[0].message) {
      return error.issues[0].unionErrors[0].issues[0].message;
    }
  }

  return error.issues[0].message;
};

export { mostrarZodError };
