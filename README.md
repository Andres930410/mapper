## Table of Contents
- [Mapper](#mapper)
  - [Installing](#installing)
  - [How to use](#how-to-use)
  - [Example](#example)
    - [For Object](#for-object)
    - [For Array](#for-array)

# Mapper

Library used to map objects, using functions and mappers, this library is similar to c# library automapper.

The library use generics in order to have a strong typing of which properties can be transformed and the types of each property.

## Installing

Using npm:

```bash
$ npm install @agutierrezt9410/mapper
```

## How to use

in order to use the library you need to create a new mapper where the types used for mapping are indicate as follow:

```ts
const mapper = new Mapper<FromModel, ToModel>(data);
```

Once the mapper is created you can add steps to the mapping process for each property, those instructions can be done using functions or other mappers.

When using functions your method can receive any property from **FromModel** using destructuring syntax.

```ts
mapper.addMapping("toModelProperty", ({args1,args2}): propertyType => {
  //Mapping logic
  return value;
})
//For sub mappers you don't have to populate the information to transform.
//That information would be get from the original data from the main mapper.
const otherMapper = new Mapper<FromOtherModel, ToOtherModel>();
mapper.addMapping("toOtherModelProperty", ({args1,args2}): propertyType => {
  return value;
})
mapper.addMapper("toModelProper","fromModelProperty", otherMapper);
```

After your mapper is configured you can get the resulting object using the transform method in the main mapper the the return type of the mapper is **toModel | toModel[]** so remember to cast to the correct type based on the data to transform.

```ts
// for getting an object
cons result = mapper.transform() as ToModel
// for getting an array
const result = mapper.transform() as ToModel[]
```

## Example

According the following models with the following data, we present an use case of the mapper, next we show a POO design, which will be used as **FromModel**.

```ts
interface User {
  name: string;
  lastName: string;
  email: string
}

interface Address {
  address: string
  city: string,
  country: string
}

interface UserAddress extends User {
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
}

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
]

```

Next we show a POO design, which will be used as **ToModel**

```ts
interface UserDto {
  fullName: string;
  email: string
}

interface AddressDto {
  text: string
}

interface UserAddressDto extends User {
  addresses: AddressDto[]
}
```

### For Object
```ts
const mapper = new Mapper<UserAddress, UserAddressDto>(data);
mapper.addMapping("fullName", ({name, lastName}): string => {
  return `${name} ${lastName}`
})
mapper.addMapping("email", ({email}): string => {
  return email ?? ""
})
const addressMapper = new Mapper<Address ,AddressDto>()
addressMapper.addMapping("text", ({address,city,country}): string => {
  return `${address}, ${city}, ${country}`
})
addressMapper.addMapper("addresses","addresses",addressMapper);
// mapper.addMapping("addresses", ({addresses}): AddressDto => {
//   return (addresses ?? []).map(x => {
//     return {
//       text: `${x.address}, ${x.city}, ${x.country}`
//     }
//   })
// })
const result = mapper.transform() as UserAddressDto
console.log(result);
//{
//   "fullName": "Name1 Lastname 1",
//   "email": "email@test.com"
//   "addresses": [
//     {text: "Fake address, Fake city, Fake country"},
//     {text: "another fake address, another fake city, another fake country"},
//   ]
//}
```

### For Array
```ts
const mapper = new Mapper<UserAddress, UserAddressDto>(data);
mapper.addMapping("fullName", ({name, lastName}): string => {
  return `${name} ${lastName}`
})
mapper.addMapping("email", ({email}): string => {
  return email ?? ""
})
const addressMapper = new Mapper<Address ,AddressDto>()
addressMapper.addMapping("text", ({address,city,country}): string => {
  return `${address}, ${city}, ${country}`
})
addressMapper.addMapper("addresses","addresses",addressMapper);
// mapper.addMapping("addresses", ({addresses}): AddressDto => {
//   return (addresses ?? []).map(x => {
//     return {
//       text: `${x.address}, ${x.city}, ${x.country}`
//     }
//   })
// })
const result = mapper.transform() as UserAddressDto[]
console.log(result);
//[{
//   "fullName": "Name1 Lastname 1",
//   "email": "email@test.com"
//   "addresses": [
//     {text: "Fake address, Fake city, Fake country"},
//     {text: "another fake address, another fake city, another fake country"},
//   ]
//}]
```