import z from "zod";

const esDominioEspecifico = (email) => {
  if (!process.env.EMAIL_DOMAIN_RESTRICT) return true;

  return email.endsWith(`@${process.env.EMAIL_DOMAIN}`);
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
  id_nivelAcademico: z
    .string({ required_error: "Selecciona el nivel academico" })
    .regex(/^\d+$/)
    .transform(Number)
    .or(z.number({ required_error: "Selecciona el nivel academico" })),
});

const emailEsquema = z.object({
  email: z
    .string({ required_error: "El correo debe ser un string" })
    .email()
    .refine((email) => esDominioEspecifico(email), {
      message: "El correo electrónico debe ser de un dominio específico",
    }),
});

const changePasswordEsquema = z.object({
  token: z.string({ required_error: "Token no valido" }),
  password: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacia")
    .min(8, { message: "La contraseña tiene que tener al menos 8 caracteres" }),
  confirm_password: z
    .string({ required_error: "La contraseña debe ser un string" })
    .nonempty("La contraseña no debe estar vacia")
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
  id_nivelAcademico: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export {
  changePasswordEsquema,
  usuarioEsquema,
  usuarioEsquemaActualizar,
  usuarioLogeoEsquema,
  emailEsquema,
};
