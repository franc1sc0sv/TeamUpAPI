import z from "zod";

const esDominioEspecifico = (email) => {
  const dominioEspecifico = "cdb.edu.sv";
  return email.endsWith(`@${dominioEspecifico}`);
};

const usuarioEsquema = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio"),
  email: z
    .string({ required_error: "El correo debe ser un string" })
    .email()
    .refine((email) => esDominioEspecifico(email), {
      message: "El correo electrónico debe ser de un dominio específico",
    }),
  password: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacio")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" }),
});

const usuarioLogeoEsquema = z.object({
  email: z
    .string()
    .email()
    .nonempty()
    .refine((email) => esDominioEspecifico(email), {
      message: "El correo electrónico debe ser de un dominio específico",
    }),
  password: z
    .string()
    .nonempty()
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" }),
});

const usuarioEsquemaActualizar = z.object({
  nombre: z
    .string({ required_error: "El nombre debe ser un string" })
    .nonempty("El nombre no debe estar vacio")
    .optional(),
  password: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacio")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" })
    .optional(),
});

export { usuarioEsquema, usuarioEsquemaActualizar, usuarioLogeoEsquema };
