// import { ConfigService } from '@nestjs/config';
// import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

// export const getMailConfig = async (
//   configService: ConfigService,
// ): Promise<any> => {
//   return {
//     transport: {
//       host: configService.get('SMTP_HOST'),
//       port: configService.get('SMTP_PORT'),
//       ignoreTLS: true,
//       secure: false,
//       auth: {
//         user: configService.get('SMTP_USER'),
//         pass: configService.get('SMTP_PASSWORD'),
//       },
//     },
//     defaults: {
//       from: configService.get('SMTP_USER'),
//     },
//     template: {
//       adapter: new EjsAdapter(),
//       options: {
//         strict: false,
//       },
//     },
//   };
// };
