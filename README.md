## Table of Contents
- [Mapper](#mapper)
- [Installing](#installing)
- [How to use](#how-to-use)
- [Example](#example)
    - [For Object](#for-object)
    - [For Array](#for-array)
- [Changelog](#changelog)
- [Acknowledgments](#acknowledgments)

# Mapper

This library used to transform objects using functions and sub-mappers. It is inspired by Automapper, a library written in C#.

The library heavily uses generics in order to have a strong typing of which properties can be transformed and which types each property should have, this new version only work with class types.

# Installing

Using npm:

```bash
$ npm install @agutierrezt9410/mapper
```

# How to use
In order to use the library you need to create a new mapper as follows:

```ts
const mapper = new Mapper<FromModel, ToModel>();
```

If you are familiar with object oriented design you can use subclassing in order to create custom mappers which can be reused as follows:

```ts
class MyCustomMapper extendes Mapper<FromModel, ToModel> {
    constructor() {
        super();
    }
}

const mapper = new MyCustomMapper();
```

Once the mapper is created you can add steps to the mapping process for each property, those instructions can be done using functions or other mappers.

When using functions your method can receive any property from **FromModel** using destructuring syntax.

Each mapper can have additonal contextual information, which can be used to create custom mapping logic, the context of the mapper can be set as follows:

```ts
mapper.context = {
    role: "ADMIN"
}
```

The context is always passed to each transformation function as an optional parameter and it can be used in this way:

```ts
mapper.addMapping("toModelProperty", ({ args1, args2 }, ctx): propertyType => {
  // Mapping logic
  if (ctx?.role === 'ADMIN') return '';
  return value;
});

const otherMapper = new Mapper<FromOtherModel, ToOtherModel>();

mapper.addMapping("toOtherModelProperty", ({ args1, args2 }): propertyType => {
  return value;
});
mapper.addMapper("toModelProper", "fromModelProperty", ToOtherModel, otherMapper);
```

It's important to also notice that when a submapper is configured then the context of the sub mapper will be combined with the context of its parent mapper in order to have better contextual information. However, when the mapper is used in isolation then its contextual information will be only the one defined by the mapper itself.

Also some mapping and mappers can be removed during the mapping process as follows:

```ts
mapper.removeMapping("toModelProper");
```

After your mapper is configured you can get the resulting object using the transform method in the main mapper. This function will return **toModel | toModel[]** based on if you are transforming an object or an array of objects, no casting is needed.

```ts
// For getting an object
const data = {}; // Object type defined in mapper declaration
const result = mapper.transform(data, ToModel);

// For getting an array
const data = []; // Array of object types defined in mapper declaration
const result = mapper.transform(data, ToModel);
```

# Example

According the following models with the following data, we present an use case of the mapper, next we show a POO design that will be used as **FromModel**:

```ts
class User {
  name: string;
  lastName: string;
  email: string
}

class Address {
  address: string
  city: string,
  country: string
}

class UserAddress extends User {
  addresses: Address[]
}

const data: UserAddress = {
  name: "Name 1",
  lastName: "Lastname 1",
  email: "email@test.com",
  addresses: [
    {
      address: "Fake address"
      city: "Fake city",
      country: "Fake country"
    },
    {
      address: "another fake address"
      city: "another fake city",
      country: "another fake country"
    }
  ]
};

const arrayData: UserAddress[] = [
  {
    name: "Name 1",
    lastName: "Lastname 1",
    email: "email@test.com",
    addresses: [
      {
        address: "Fake address"
        city: "Fake city",
        country: "Fake country"
      },
      {
        address: "another fake address"
        city: "another fake city",
        country: "another fake country"
      }
    ]
  }
];

```

Next we show a POO design, which will be used as **ToModel**:

```ts
class UserDto {
  fullName: string;
  @IsEmail() // class transformer decorator
  email: string
}

class AddressDto {
  text: string
}

class UserAddressDto extends User {
  addresses: AddressDto[]
}
```

### For Object
```ts
const mapper = new Mapper<UserAddress, UserAddressDto>();

mapper.addMapping("fullName", ({ name, lastName }): string => {
  return `${name} ${lastName}`;
});
mapper.addMapping("email", ({ email }): string => {
  return email ?? "";
});

const addressMapper = new Mapper<Address ,AddressDto>();

addressMapper.addMapping("text", ({ address, city, country }): string => {
  return `${address}, ${city}, ${country}`;
});

addressMapper.addMapper("addresses","addresses",AddressDto,addressMapper);
// mapper.addMapping("addresses", ({addresses}): AddressDto => {
//   return (addresses ?? []).map(x => {
//     return {
//       text: `${x.address}, ${x.city}, ${x.country}`
//     }
//   })
// })
//This function will create a new object using the transformation logic
const result = mapper.transform(data,UserAddressDto);
//result instance of UserAddressDto -> true
console.log(result);
//{
//   "fullName": "Name1 Lastname 1",
//   "email": "email@test.com"
//   "addresses": [
//     {text: "Fake address, Fake city, Fake country"},
//     {text: "another fake address, another fake city, another fake country"},
//   ]
//}
//This function not only will create a new object based on the transformation logic but also check if the properties satisfy with some validations, for instance if the email property is not a valid email, the function will generate an exception.
const resultValidated = mapper.transformAndValidate(data,UserAddressDto);
```

### For Array
```ts
const mapper = new Mapper<UserAddress, UserAddressDto>();

mapper.addMapping("fullName", ({name, lastName}): string => {
  return `${name} ${lastName}`
});
mapper.addMapping("email", ({email}): string => {
  return email ?? ""
});

const addressMapper = new Mapper<Address ,AddressDto>();

addressMapper.addMapping("text", ({address,city,country}): string => {
  return `${address}, ${city}, ${country}`
});
addressMapper.addMapper("addresses","addresses",addressMapper);
// mapper.addMapping("addresses", ({addresses}): AddressDto => {
//   return (addresses ?? []).map(x => {
//     return {
//       text: `${x.address}, ${x.city}, ${x.country}`
//     }
//   })
// })
const result: UserAddressDto[] = mapper.transform(data);
console.log(result);
//[{
//   "fullName": "Name1 Lastname 1",
//   "email": "email@test.com"
//   "addresses": [
//     {text: "Fake address, Fake city, Fake country"},
//     {text: "another fake address, another fake city, another fake country"},
//   ]
//}]
//The validate function can be used also with array, if any object doesn't satisfy the validaiton the method will generate an exception, indicate the position of the first object into the array which doesn't satisfy the validiations.
const resultValidated = mapper.transformAndValidate(data,UserAddressDto);
```

# Changelog
- 0.0.1: Initial version
- 0.0.2: Reusable mapper, type safety for return type on the transform function and remove mapping.
- 1.0.0: Now the mapper uses class transformer and class validator for validations and to guarantee that class types are returned instead of plain JavaScript objects.
    - Added:
        - Context can be added to the mappers, the context will be passed to each transformation function and it could be used for adding custom logic into the mappings.
        - Use class transformer for returning an specific class type instead of a plain javascript object.
        - New method for not only transforming but also validating if the information satisfies with some validation, this feature uses class validator.

# Acknowledgments
I would like to thanks Trammel May. After a small discussion he pointed to me some problems that my library could have, those problems were addressed and solved.