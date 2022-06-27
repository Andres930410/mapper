import { Mapper } from '@/mapper/mapper';

interface User {
  name: string;
  lastName: string;
  email: string;
}

interface Address {
  address: string;
  city: string;
  country: string;
}

interface UserAddress extends User {
  address: Address;
}

interface UserAddresses extends User {
  addresses: Address[];
}

interface UserWithoutEmailDto {
  fullName: string;
}

interface UserDto extends UserWithoutEmailDto {
  email: string;
}

interface UserDtoWithUsername extends UserDto {
  username: string;
}

interface AddressDto {
  address: string;
}

interface UserWithAddressDto extends UserDto {
  address: AddressDto;
}

interface UserWithAddressesDto extends UserDto {
  addresses: AddressDto[];
}

interface UserWithAddressWithoutNestingDto extends UserDto {
  address: string;
}

interface UserWithAddressesWithoutNestingDto extends UserDto {
  addresses: string[];
}

describe('Mapper testing', () => {
  let user: User;
  let userTwo: User;
  let users: User[];
  let userWithoutEmail: UserWithoutEmailDto;
  let usersWithoutEmail: UserWithoutEmailDto[];
  let userDto: UserDto;
  let usersDto: UserDto[];
  let userWithUsernameDto: UserDtoWithUsername;
  let usersWithUsernameDto: UserDtoWithUsername[];

  let userWithAddress: UserAddress;
  let userWithAddressDto: UserWithAddressDto;
  let userWithAddressTwoDto: UserWithAddressWithoutNestingDto;

  let usersWithAddress: UserAddress[];
  let usersWithAddressDto: UserWithAddressDto[];
  let usersWithAddressTwoDto: UserWithAddressWithoutNestingDto[];

  let userWithAddresses: UserAddresses;
  let userWithAddressesDto: UserWithAddressesDto;
  let userWithAddressesTwoDto: UserWithAddressesWithoutNestingDto;

  let usersWithAddresses: UserAddresses[];
  let usersWithAddressesDto: UserWithAddressesDto[];
  let usersWithAddressesTwoDto: UserWithAddressesWithoutNestingDto[];

  beforeAll(() => {
    users = [];
    usersWithoutEmail = [];
    usersDto = [];
    usersWithUsernameDto = [];
    usersWithAddress = [];
    usersWithAddressDto = [];
    usersWithAddressTwoDto = [];
    usersWithAddresses = [];
    usersWithAddressesDto = [];
    usersWithAddressesTwoDto = [];

    user = {
      name: 'Andres',
      lastName: 'Gutierrez',
      email: 'agutierrezt@slabcode.com',
    };

    userTwo = {
      name: 'Samuel',
      lastName: 'Reyes',
      email: 'wsreyes@slabcode.com',
    };

    users.push(user, userTwo);

    userWithoutEmail = {
      fullName: `${user.name} ${user.lastName}`,
    };

    userDto = {
      fullName: `${user.name} ${user.lastName}`,
      email: user.email,
    };

    usersWithoutEmail.push(
      {
        fullName: `${user.name} ${user.lastName}`,
      },
      {
        fullName: `${userTwo.name} ${userTwo.lastName}`,
      },
    );

    usersDto.push(
      {
        fullName: `${user.name} ${user.lastName}`,
        email: user.email,
      },
      {
        fullName: `${userTwo.name} ${userTwo.lastName}`,
        email: userTwo.email,
      },
    );

    userWithUsernameDto = {
      fullName: `${user.name} ${user.lastName}`,
      email: user.email,
      username: user.email.split('@')[0],
    };

    usersWithUsernameDto.push(
      {
        fullName: `${user.name} ${user.lastName}`,
        email: user.email,
        username: user.email.split('@')[0],
      },
      {
        fullName: `${userTwo.name} ${userTwo.lastName}`,
        email: userTwo.email,
        username: userTwo.email.split('@')[0],
      },
    );

    userWithAddress = {
      ...user,
      address: {
        address: 'KR 44A # 24D-21',
        city: 'Bogota',
        country: 'Colombia',
      },
    };

    userWithAddressDto = {
      ...userDto,
      address: {
        address: `${userWithAddress.address.address}, ${userWithAddress.address.city}, ${userWithAddress.address.country}`,
      },
    };

    userWithAddressTwoDto = {
      ...userDto,
      address: `${userWithAddress.address.address}, ${userWithAddress.address.city}, ${userWithAddress.address.country}`,
    };

    usersWithAddress.push(userWithAddress);
    usersWithAddressDto.push(userWithAddressDto);
    usersWithAddressTwoDto.push(userWithAddressTwoDto);

    userWithAddresses = {
      ...user,
      addresses: [
        {
          address: 'KR 44A # 24D-21',
          city: 'Bogota',
          country: 'Colombia',
        },
      ],
    };

    userWithAddressesDto = {
      ...userDto,
      addresses: [
        {
          address: `${userWithAddress.address.address}, ${userWithAddress.address.city}, ${userWithAddress.address.country}`,
        },
      ],
    };

    userWithAddressesTwoDto = {
      ...userDto,
      addresses: [
        `${userWithAddress.address.address}, ${userWithAddress.address.city}, ${userWithAddress.address.country}`,
      ],
    };

    usersWithAddresses.push(userWithAddresses);
    usersWithAddressesDto.push(userWithAddressesDto);
    usersWithAddressesTwoDto.push(userWithAddressesTwoDto);
  });

  describe('Mapping without nesting', () => {
    describe('Ignore properties', () => {
      it('Map object', () => {
        const mapper = new Mapper<User, UserWithoutEmailDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        const result: UserWithoutEmailDto = mapper.transform(user);
        expect(result).toEqual(userWithoutEmail);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserWithoutEmailDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        const result: UserWithoutEmailDto[] = mapper.transform(users);
        expect(result).toEqual(usersWithoutEmail);
        expect(result.length).toBe(2);
        expect(result[0].fullName).toBe(`${user.name} ${user.lastName}`);
      });
    });
    describe('All properties', () => {
      it('Map object', () => {
        const mapper = new Mapper<User, UserDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const result: UserDto = mapper.transform(user);
        expect(result).toEqual(userDto);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
        expect(result.email).toBe(user.email);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const result: UserDto[] = mapper.transform(users);
        expect(result).toEqual(usersDto);
        expect(result.length).toBe(2);
        expect(result[0].email).toBe(user.email);
      });
    });
    describe('Calculate properties', () => {
      it('Map object', () => {
        const mapper = new Mapper<User, UserDtoWithUsername>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('username', ({ email }): string => {
          return (email ?? '').split('@')[0];
        });
        const result: UserDtoWithUsername = mapper.transform(user);
        expect(result).toEqual(userWithUsernameDto);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
        expect(result.username).toBe(user.email.split('@')[0]);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserDtoWithUsername>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('username', ({ email }): string => {
          return (email ?? '').split('@')[0];
        });
        const result: UserDtoWithUsername[] = mapper.transform(users);
        expect(result).toEqual(usersWithUsernameDto);
        expect(result.length).toBe(2);
        expect(result[0].username).toBe(user.email.split('@')[0]);
      });
    });
    describe('Remove properties', () => {
      it('Map object', () => {
        const mapper = new Mapper<User, UserDtoWithUsername>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('username', ({ email }): string => {
          return (email ?? '').split('@')[0];
        });
        mapper.removeMapping('email');
        const result: UserDtoWithUsername = mapper.transform(user);
        expect(result).toEqual({
          "fullName": "Andres Gutierrez",
          "username": "agutierrezt",
        });
        expect(result.email).toBe(undefined);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
        expect(result.username).toBe(user.email.split('@')[0]);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserDtoWithUsername>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('username', ({ email }): string => {
          return (email ?? '').split('@')[0];
        });
        const result: UserDtoWithUsername[] = mapper.transform(users);
        expect(result).toEqual(usersWithUsernameDto);
        expect(result.length).toBe(2);
        expect(result[0].username).toBe(user.email.split('@')[0]);
      });
    });
  });

  describe('Mapping with nesting object to nesting object', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return {
            address: `${address?.address}, ${address?.city}, ${address?.country}`,
          };
        });

        const result: UserWithAddressDto = mapper.transform(userWithAddress);
        expect(result).toEqual(userWithAddressDto);
        expect(result.address).toEqual(userWithAddressDto.address);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return {
            address: `${address?.address}, ${address?.city}, ${address?.country}`,
          };
        });

        const result: UserWithAddressDto[] = mapper.transform(usersWithAddress);
        expect(result).toEqual(usersWithAddressDto);
        expect(result.length).toBe(1);
        expect(result[0].address).toEqual(userWithAddressDto.address);
      });
    });
    describe('Using sub mapper', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>();
        mapperAddress.addMapping('address', ({ address, country, city }) => {
          return `${address}, ${city}, ${country}`;
        });
        mapper.addMapper('address', 'address', mapperAddress);
        const result: UserWithAddressDto = mapper.transform(userWithAddress);
        expect(result).toEqual(userWithAddressDto);
        expect(result.address).toEqual(userWithAddressDto.address);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>();
        mapperAddress.addMapping('address', ({ address, country, city }) => {
          return `${address}, ${city}, ${country}`;
        });
        mapper.addMapper('address', 'address', mapperAddress);
        const result: UserWithAddressDto[] = mapper.transform(usersWithAddress);
        expect(result).toEqual(usersWithAddressDto);
        expect(result.length).toBe(1);
        expect(result[0].address).toEqual(userWithAddressDto.address);
      });
    });
  });

  describe('Mapping with nesting object to primitive', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressWithoutNestingDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return `${address?.address}, ${address?.city}, ${address?.country}`;
        });

        const result: UserWithAddressWithoutNestingDto = mapper.transform(userWithAddress);
        expect(result).toEqual(userWithAddressTwoDto);
        expect(result.address).toEqual(userWithAddressTwoDto.address);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressWithoutNestingDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return `${address?.address}, ${address?.city}, ${address?.country}`;
        });

        const result: UserWithAddressWithoutNestingDto[] = mapper.transform(usersWithAddress);
        expect(result).toEqual(usersWithAddressTwoDto);
        expect(result.length).toBe(1);
        expect(result[0].address).toEqual(userWithAddressTwoDto.address);
      });
    });
  });

  describe('Mapping with array of nesting objects to array of nesting objects', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('addresses', ({ addresses }) => {
          return (
            addresses?.map((address) => {
              return {
                address: `${address?.address}, ${address?.city}, ${address?.country}`,
              };
            }) ?? []
          );
        });

        const result: UserWithAddressesDto = mapper.transform(userWithAddresses);
        expect(result).toEqual(userWithAddressesDto);
        expect(result.addresses).toEqual(userWithAddressesDto.addresses);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('addresses', ({ addresses }) => {
          return (
            addresses?.map((address) => {
              return {
                address: `${address?.address}, ${address?.city}, ${address?.country}`,
              };
            }) ?? []
          );
        });

        const result: UserWithAddressesDto[] = mapper.transform(usersWithAddresses);
        expect(result).toEqual(usersWithAddressesDto);
        expect(result.length).toBe(1);
        expect(result[0].addresses).toEqual(userWithAddressesDto.addresses);
      });
    });
    describe('Using sub mapper', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>();
        mapperAddress.addMapping('address', ({ address, country, city }) => {
          return `${address}, ${city}, ${country}`;
        });
        mapper.addMapper('addresses', 'addresses', mapperAddress);
        const result: UserWithAddressesDto = mapper.transform(userWithAddresses);
        expect(result).toEqual(userWithAddressesDto);
        expect(result.addresses).toEqual(userWithAddressesDto.addresses);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>();
        mapperAddress.addMapping('address', ({ address, country, city }) => {
          return `${address}, ${city}, ${country}`;
        });
        mapper.addMapper('addresses', 'addresses', mapperAddress);
        const result: UserWithAddressesDto[] = mapper.transform(usersWithAddresses);
        expect(result).toEqual(usersWithAddressesDto);
        expect(result.length).toBe(1);
        expect(result[0].addresses).toEqual(userWithAddressesDto.addresses);
      });
    });
  });

  describe('Mapping with array of nesting object to array of primitive', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesWithoutNestingDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('addresses', ({ addresses }) => {
          return (
            addresses?.map((address) => {
              return `${address?.address}, ${address?.city}, ${address?.country}`;
            }) ?? []
          );
        });

        const result: UserWithAddressesWithoutNestingDto = mapper.transform(userWithAddresses);
        expect(result).toEqual(userWithAddressesTwoDto);
        expect(result.addresses).toEqual(userWithAddressesTwoDto.addresses);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressWithoutNestingDto>();
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return `${address?.address}, ${address?.city}, ${address?.country}`;
        });

        const result: UserWithAddressWithoutNestingDto[] = mapper.transform(usersWithAddress);
        expect(result).toEqual(usersWithAddressTwoDto);
        expect(result.length).toBe(1);
        expect(result[0].address).toEqual(userWithAddressTwoDto.address);
      });
    });
  });

  describe('Mapping primitive to object', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserWithAddressDto, UserAddress>();
        mapper.addMapping('name', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[0];
        });
        mapper.addMapping('lastName', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[1];
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          const components = (address?.address ?? '').split(',');
          return {
            address: components[0],
            city: components[1].trim(),
            country: components[2].trim(),
          };
        });

        const result: UserAddress = mapper.transform(userWithAddressDto);
        expect(result).toEqual(userWithAddress);
        expect(result.address).toEqual(userWithAddress.address);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserWithAddressesDto, UserAddresses>();
        mapper.addMapping('name', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[0];
        });
        mapper.addMapping('lastName', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[1];
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('addresses', ({ addresses }) => {
          return (
            addresses?.map((address) => {
              const components = (address?.address ?? '').split(',');
              return {
                address: components[0],
                city: components[1].trim(),
                country: components[2].trim(),
              };
            }) ?? []
          );
        });

        const result: UserAddresses[] = mapper.transform(usersWithAddressesDto);
        expect(result).toEqual(usersWithAddresses);
        expect(result.length).toBe(1);
        expect(result[0].addresses).toEqual(usersWithAddresses[0].addresses);
      });
    });
  });

  describe('Mapping array of primitives to array of objects', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserWithAddressesWithoutNestingDto, UserAddresses>();
        mapper.addMapping('name', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[0];
        });
        mapper.addMapping('lastName', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[1];
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('addresses', ({ addresses }) => {
          return (
            addresses?.map((address) => {
              const components = (address ?? '').split(',');
              return {
                address: components[0],
                city: components[1].trim(),
                country: components[2].trim(),
              };
            }) ?? []
          );
        });

        const result: UserAddresses = mapper.transform(userWithAddressesTwoDto);
        expect(result).toEqual(userWithAddresses);
        expect(result.addresses).toEqual(userWithAddresses.addresses);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserWithAddressesWithoutNestingDto, UserAddresses>();
        mapper.addMapping('name', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[0];
        });
        mapper.addMapping('lastName', ({ fullName }): string => {
          return (fullName ?? '').split(' ')[1];
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('addresses', ({ addresses }) => {
          return (
            addresses?.map((address) => {
              const components = (address ?? '').split(',');
              return {
                address: components[0],
                city: components[1].trim(),
                country: components[2].trim(),
              };
            }) ?? []
          );
        });
        const result: UserAddresses[] = mapper.transform(usersWithAddressesTwoDto);
        expect(result).toEqual(usersWithAddresses);
        expect(result.length).toBe(1);
        expect(result[0].addresses).toEqual(usersWithAddresses[0].addresses);
      });
    });
  });
});
