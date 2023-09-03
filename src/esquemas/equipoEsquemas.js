import z from "zod";

const crearEquipoEsquema = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
  password_access: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" }),
});

const unirseEquipoEsquema = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio"),
  password_access: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" }),
});

const actualizarEquipoEsquema = z.object({
  nombre: z
    .string({ required_error: "nombre_requerido" })
    .nonempty("nombre_vacio")
    .optional(),
  old_password_access: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" })
    .optional(),
  new_password_access: z
    .string({ required_error: "password_requerido" })
    .nonempty("password_vacio")
    .min(8, { message: "password_min_length" })
    .optional(),
});

const cambiarLiderEsquema = z.object({
  id_lider: z
    .number({ required_error: "number_requerido" })
    .nonnegative({ message: "positive_nmber" }),
});

const eliminarMiembro = z.object({
  id_usuarios: z
    .number({ required_error: "number_requerido" })
    .nonnegative({ message: "positive_nmber" }),
});

export {
  crearEquipoEsquema,
  actualizarEquipoEsquema,
  unirseEquipoEsquema,
  cambiarLiderEsquema,
  eliminarMiembro,
};
