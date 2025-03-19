import Joi from "joi";

// role schema
export const roleSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  description: Joi.string().optional().allow(""),
}).options({ allowUnknown: true });

// user schema
export const userSchema = Joi.object({
  id: Joi.number().optional(),
  username: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    // otherwise: Joi.required(),
  }),
  full_name: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  email: Joi.string().email().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  role_id: Joi.number().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    // otherwise: Joi.required(),
  }),
  password: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    // otherwise: Joi.required(),
  }),
  status: Joi.number().optional(),
}).options({ allowUnknown: true });

// about us schema
const aboutUsEntrySchema = Joi.object({
  id: Joi.number().integer().optional(),
  description: Joi.string().optional(),
  title: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  direction: Joi.string().optional().allow(""),
  image: Joi.string()
    .pattern(/^data:image\/(png|jpg|jpeg);base64,/)
    .when("id", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
});

export const aboutUsSchema = Joi.array().items(aboutUsEntrySchema).min(1).required().options({ allowUnknown: true });

// product schema
const productEntrySchema = Joi.object({
  id: Joi.number().integer().optional(),
  title: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  description: Joi.string().optional().allow(""),
  image: Joi.string()
    .pattern(/^data:image\/(png|jpg|jpeg);base64,/)
    .when("id", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
});

export const productSchema = Joi.array().items(productEntrySchema).min(1).required().options({ allowUnknown: true });

// contact schema
export const contactSchema = Joi.object({
  id: Joi.number().optional(), // Optional id
  sections: Joi.array()
    .items(
      Joi.object({
        section: Joi.number().required(),
        description: Joi.string().required(),

        subsections: Joi.array()
          .items(
            Joi.object({
              label_1: Joi.string().required(),
              label_2: Joi.string().required(),
            })
          )
          .min(1)
          .optional(), // If subsections exist, at least one is required, otherwise it's optional
      })
    )
    .min(1)
    .required(), // At least one section is required
}).options({ allowUnknown: true });

// location schema
export const locationSchema = Joi.object({
  id: Joi.number().optional(),
  sections: Joi.alternatives().conditional("id", {
    is: Joi.exist(),
    then: Joi.array().items(
      Joi.object({
        section: Joi.number().required(),
        title: Joi.string().required(),
        location: Joi.string().required(),
        latitude: Joi.string()
          .pattern(/^[-+]?[0-9]*\.?[0-9]+$/)
          .required(),
        longitude: Joi.string()
          .pattern(/^[-+]?[0-9]*\.?[0-9]+$/)
          .required(),
        support_number: Joi.string()
          .pattern(/^[0-9]{10}$/)
          .required(),
      })
    ), // Allows any number of items if `id` is present
    otherwise: Joi.array()
      .items(
        Joi.object({
          section: Joi.number().required(),
          title: Joi.string().required(),
          location: Joi.string().required(),
          latitude: Joi.string()
            .pattern(/^[-+]?[0-9]*\.?[0-9]+$/)
            .required(),
          longitude: Joi.string()
            .pattern(/^[-+]?[0-9]*\.?[0-9]+$/)
            .required(),
          support_number: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required(),
        })
      )
      .min(1), // Requires at least one item in sections if `id` does not exist
  }),
});
export const sectionManagerSchema = Joi.object({
  id: Joi.number().optional(),
  sections: Joi.alternatives().conditional("id", {
    is: Joi.exist(),
    then: Joi.array().items(
      Joi.object({
        sequence: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      })
    ), // Allows any number of items if `id` is present
    otherwise: Joi.array()
      .items(
        Joi.object({
          sequence: Joi.number().required(),
          title: Joi.string().required(),
          description: Joi.string().required(),
        })
      )
      .min(1), // Requires at least one item in sections if `id` does not exist
  }),
});

// partner schema
const partnerEntrySchema = Joi.object({
  id: Joi.number().integer().optional(),
  partner_name: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  website_url: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  image: Joi.string()
    .pattern(/^data:image\/(png|jpg|jpeg);base64,/)
    .when("id", {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
});

export const partnerSchema = Joi.array().items(partnerEntrySchema).min(1).required().options({ allowUnknown: true });

export const navigationSchema = Joi.object({
  id: Joi.number().optional(), // Optional, required for update
  menu_items: Joi.array()
    .min(0)
    .items(
      Joi.object({
        sequence: Joi.number().integer().required(),
        title: Joi.string().required(),
        url_link: Joi.string().required(),
        status: Joi.string().valid("Active", "In Active", "Draft").required(),
      })
    )
    .required(),
}).options({ allowUnknown: true });

export const blogSchema = Joi.object({
  id: Joi.number().integer().optional(),
  transition_type: Joi.string().valid("Slide", "Fade", "Dissolve").optional(),
  transition_duration: Joi.string().max(255).optional(),
  banner_height: Joi.number().integer().optional(),
  autoplay: Joi.string().valid("Yes", "No").optional(),
  pause_on_hover: Joi.string().valid("Yes", "No").optional(),
  navigation_arrows: Joi.string().valid("Yes", "No").optional(),
  pagination_dots: Joi.string().valid("Yes", "No").optional(),

  slides: Joi.array()
    .items(
      Joi.object({
        author: Joi.string().max(255).optional(),
        title: Joi.string().max(255).optional(),
        summary: Joi.string().max(500).optional(),
        publication_date: Joi.date().iso().optional(),
        read_more_url: Joi.string().uri().optional(),
        hashtags: Joi.array().items(Joi.string().max(100)).optional(),
      })
    )
    .min(1)
    .required(), // Ensures that at least one slide object is present
}).or(
  "id",
  "transition_type",
  "transition_duration",
  "banner_height",
  "autoplay",
  "pause_on_hover",
  "navigation_arrows",
  "pagination_dots",
  "slides"
);

export const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const queryFormSchema = Joi.object({
  id: Joi.number().optional(),
  username: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  email: Joi.string().email().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  mobile: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  country: Joi.string().optional().allow(""),
  query: Joi.string().required(),
  product_id: Joi.number().integer().required(),
}).options({ allowUnknown: true });
export const contactFormSchema = Joi.object({
  id: Joi.number().optional(),
  username: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  email: Joi.string().email().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  mobile: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  message: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
}).options({ allowUnknown: true });

export const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const replySchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  reply: Joi.string().required(),
}).options({ allowUnknown: true });

export const labelSchema = Joi.object({
  label: Joi.string().required(),
}).options({ allowUnknown: true });

export const idsSchema = Joi.object({
  ids: Joi.array().items(Joi.string().required()).required(),
}).options({ allowUnknown: true });

export const sendEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
}).options({ allowUnknown: true });

export const socialMediaSecretSchema = Joi.object({
  // type: Joi.string().required(),
  client_id: Joi.string().required(),
  client_secret: Joi.string().required(),
}).options({ allowUnknown: true });

export const postFbSchema = Joi.object({
  message: Joi.string().required(),
  link: Joi.string().optional().allow(""),
  // published: Joi.boolean().required(),
  // publish_time: Joi.alternatives().conditional("published", {
  //   is: false, // When published is false
  //   then: Joi.string()
  //     .required()
  //     .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "date format")
  //     .messages({
  //       "string.pattern.name": "publish_time must be in the format YYYY-MM-DD HH:mm:ss",
  //       "any.required": "publish_time is required when published is false",
  //     }),
  //   otherwise: Joi.forbidden().messages({
  //     "any.unknown": "publish_time is not allowed when published is true",
  //   }), // Disallow publish_time if published is true
  // }),
}).options({ allowUnknown: true });

export const moduleSchema = Joi.object({
  id: Joi.number().optional(),
  name: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  path: Joi.string().when("id", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  parent_id: Joi.number().optional(),
}).options({ allowUnknown: true });

export const donationSchema = Joi.object({
  id: Joi.number().optional(),
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required().allow(""),
  donation_amount: Joi.required().allow(""),
  
  aadhar_number: Joi.alternatives().conditional("pan_number", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Either Aadhar Number or PAN Number is required.",
    }),
  }),
  
  pan_number: Joi.alternatives().conditional("aadhar_number", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Either PAN Number or Aadhar Number is required.",
    }),
  }),
  
  aadhar_url: Joi.string().optional().allow(""),
  pan_url: Joi.string().optional().allow(""),
  address: Joi.string().optional().allow(""),
  user_id: Joi.number().optional(),
  deleted: Joi.number().valid(0, 1).default(0),
}).options({ allowUnknown: true });

export const ourInspirationSchema = Joi.object({
  id: Joi.number().optional(),
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required().allow(""),
  donation_amount: Joi.required().allow(""),
  
  aadhar_number: Joi.alternatives().conditional("pan_number", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Either Aadhar Number or PAN Number is required.",
    }),
  }),
  
  pan_number: Joi.alternatives().conditional("aadhar_number", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Either PAN Number or Aadhar Number is required.",
    }),
  }),
  
  aadhar_url: Joi.string().optional().allow(""),
  pan_url: Joi.string().optional().allow(""),
  address: Joi.string().optional().allow(""),
  user_id: Joi.number().optional(),
  deleted: Joi.number().valid(0, 1).default(0),
}).options({ allowUnknown: true });

export const bannerSectionSchema = Joi.object({
  id: Joi.number().optional(),
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required().allow(""),
  donation_amount: Joi.required().allow(""),
  
  aadhar_number: Joi.alternatives().conditional("pan_number", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Either Aadhar Number or PAN Number is required.",
    }),
  }),
  
  pan_number: Joi.alternatives().conditional("aadhar_number", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      "any.required": "Either PAN Number or Aadhar Number is required.",
    }),
  }),
  
  aadhar_url: Joi.string().optional().allow(""),
  pan_url: Joi.string().optional().allow(""),
  address: Joi.string().optional().allow(""),
  user_id: Joi.number().optional(),
  deleted: Joi.number().valid(0, 1).default(0),
}).options({ allowUnknown: true });