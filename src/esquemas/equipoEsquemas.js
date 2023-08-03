import z from "zod";

const crearEquipoEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  password_access: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacio")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" }),
});

const unirseEquipoEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  password_access: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacio")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" }),
});

const actualizarEquipoEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio")
    .optional(),
  old_password_access: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacio")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" })
    .optional(),
  new_password_access: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacio")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" })
    .optional(),
});

const cambiarLiderEsquema = z.object({
  id_lider: z.number(),
});

const eliminarMiembro = z.object({
  id_usuarios: z.number(),
});

export {
  crearEquipoEsquema,
  actualizarEquipoEsquema,
  unirseEquipoEsquema,
  cambiarLiderEsquema,
  eliminarMiembro,
};
