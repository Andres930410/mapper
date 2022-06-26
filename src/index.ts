export * from '@/mapper/abstractMapper';
export * from '@/mapper/mapper';
export * from '@/mapper/translator';
// import { Mapper } from "@/mapper/mapper";

// interface Model3 {
//   address: string;
//   city: string;
//   country: string;
// }

// interface Model5 {
//   data: string;
// }

// interface Model6 {
//   len: number;
// }

// interface Model1 {
//   name: string;
//   lastName: string;
//   values: Model3[];
//   data: Model5;
// }

// interface Model4 {
//   address: string;
// }

// interface Model2 {
//   fullName: string;
//   otherValue: boolean;
//   address: Model4[];
//   len: Model6;
// }

// const a: Model1[] = [
//   {
//     name: "Andres",
//     lastName: "Gutierrez",
//     values: [
//       { address: "calle falsa", country: "colombia", city: "bogota" },
//       { address: "otra direción", country: "colombia", city: "bogota" },
//     ],
//     data: {
//       data: "dsfasdf sadf asdf asdf",
//     },
//   },
//   {
//     name: "Samuel",
//     lastName: "Reyes",
//     values: [
//       { address: "calle falsa", country: "argentina", city: "bogota" },
//       { address: "otra direción", country: "peru", city: "bogota" },
//     ],
//     data: {
//       data: "Andres",
//     },
//   },
// ];

// const mapper = new Mapper<Model1, Model2>(a);
// const otherMapper = new Mapper<Model3, Model4>();
// const otherMapper1 = new Mapper<Model5, Model6>();

// otherMapper.addMapping("address", ({ address, city, country }): string => {
//   return `${address}: ${city}-${country}`;
// });
// otherMapper1.addMapping("len", ({ data }): number => {
//   return data?.length ?? 0;
// });
// mapper.addMapping("fullName", ({ name, lastName }): string => {
//   return `${name} ${lastName}`;
// });
// mapper.addMapping("otherValue", ({ name }) => {
//   return false;
// });
// mapper.addMapper("address", "values", otherMapper);
// mapper.addMapper("len", "data", otherMapper1);
// // mapper.addMapping("len", ({ data }): Model6 => {
// //   return {
// //     len: data?.data.length ?? 0,
// //   };
// // });
// const result = mapper.transform();
// console.log(JSON.stringify(result));
