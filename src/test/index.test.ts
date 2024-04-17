import { TransformationError } from '@/error/transformation.error';
import { Mapper } from '@/mapper/mapper';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

class User {
  name: string;
  lastName: string;
  email: string;

  public get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }
}

class Address {
  address: string;
  city: string;
  country: string;
}

class UserAddress extends User {
  address: Address;
}

class UserAddresses extends User {
  addresses: Address[];
}

class UserWithoutEmailDto {
  @IsString()
  @Length(3)
  fullName: string;
}

class UserDto extends UserWithoutEmailDto {
  @IsEmail()
  email: string;
}

class UserDtoWithUsername extends UserDto {
  username: string;
}

class AddressDto {
  address: string;
}

class UserWithAddressDto extends UserDto {
  address: AddressDto;
}

class UserWithAddressesDto extends UserDto {
  addresses: AddressDto[];
}

class UserWithAddressWithoutNestingDto extends UserDto {
  address: string;
}

class UserWithAddressesWithoutNestingDto extends UserDto {
  addresses: string[];
}

class Company {
  id: number;
  name: string;
}

class CompanyDto {
  name: string;

  capitalizedName(): string {
    return this.name.toUpperCase();
  }
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

    user = plainToClass(User, {
      name: 'Andres',
      lastName: 'Gutierrez',
      email: 'agutierrezt@slabcode.com',
    });

    userTwo = plainToClass(User, {
      name: 'Samuel',
      lastName: 'Reyes',
      email: 'wsreyes@slabcode.com',
    });

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
    } as UserAddress;

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
    } as UserAddresses;

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
        const mapper = new Mapper<User, UserWithoutEmailDto>(User, UserWithoutEmailDto);
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        const result: UserWithoutEmailDto = mapper.transform(user);
        expect(result).toEqual(userWithoutEmail);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
      });
      it('Map object using getter', () => {
        const mapper = new Mapper<User, UserWithoutEmailDto>(User, UserWithoutEmailDto);
        mapper.addMapping('fullName', ({ fullName }): string => {
          return fullName ?? '';
        });
        const result: UserWithoutEmailDto = mapper.transform(user);
        expect(result).toEqual(userWithoutEmail);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserWithoutEmailDto>(User, UserWithoutEmailDto);
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
        const mapper = new Mapper<User, UserDto>(User, UserDto);
        mapper.context = {
          prefix: 'SR.',
        };
        mapper.addMapping('fullName', ({ name, lastName }, ctx): string => {
          return `${ctx?.prefix} ${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const result: UserDto = mapper.transform(user);
        // expect(result).toEqual(userDto);
        expect(result.fullName).toBe(`SR. ${user.name} ${user.lastName}`);
        expect(result.email).toBe(user.email);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserDto>(User, UserDto);
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
        const mapper = new Mapper<User, UserDtoWithUsername>(User, UserDtoWithUsername);
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
        const mapper = new Mapper<User, UserDtoWithUsername>(User, UserDtoWithUsername);
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
        const mapper = new Mapper<User, UserDtoWithUsername>(User, UserDtoWithUsername);
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
          fullName: 'Andres Gutierrez',
          username: 'agutierrezt',
        });
        expect(result.email).toBe(undefined);
        expect(result.fullName).toBe(`${user.name} ${user.lastName}`);
        expect(result.username).toBe(user.email.split('@')[0]);
      });
      it('Map array', () => {
        const mapper = new Mapper<User, UserDtoWithUsername>(User, UserDtoWithUsername);
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
        const mapper = new Mapper<UserAddress, UserWithAddressDto>(
          UserAddress,
          UserWithAddressDto,
        );
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
        const mapper = new Mapper<UserAddress, UserWithAddressDto>(
          UserAddress,
          UserWithAddressDto,
        );
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
        const mapper = new Mapper<UserAddress, UserWithAddressDto>(
          UserAddress,
          UserWithAddressDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>(Address, AddressDto);
        mapperAddress.addMapping('address', ({ address, country, city }) => {
          return `${address}, ${city}, ${country}`;
        });
        mapper.addMapper('address', 'address', mapperAddress);
        const result: UserWithAddressDto = mapper.transform(userWithAddress);
        expect(result).toEqual(userWithAddressDto);
        expect(result.address instanceof AddressDto).toBe(true);
        expect(result.address).toEqual(userWithAddressDto.address);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressDto>(
          UserAddress,
          UserWithAddressDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>(Address, AddressDto);
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
        const mapper = new Mapper<UserAddress, UserWithAddressWithoutNestingDto>(
          UserAddress,
          UserWithAddressWithoutNestingDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return `${address?.address}, ${address?.city}, ${address?.country}`;
        });

        const result: UserWithAddressWithoutNestingDto =
          mapper.transform(userWithAddress);
        expect(result).toEqual(userWithAddressTwoDto);
        expect(result.address).toEqual(userWithAddressTwoDto.address);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressWithoutNestingDto>(
          UserAddress,
          UserWithAddressWithoutNestingDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return `${address?.address}, ${address?.city}, ${address?.country}`;
        });

        const result: UserWithAddressWithoutNestingDto[] =
          mapper.transform(usersWithAddress);
        expect(result).toEqual(usersWithAddressTwoDto);
        expect(result.length).toBe(1);
        expect(result[0].address).toEqual(userWithAddressTwoDto.address);
      });
    });
  });

  describe('Mapping with array of nesting objects to array of nesting objects', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>(
          UserAddresses,
          UserWithAddressesDto,
        );
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
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>(
          UserAddresses,
          UserWithAddressesDto,
        );
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
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>(
          UserAddresses,
          UserWithAddressesDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>(Address, AddressDto);
        mapperAddress.addMapping('address', ({ address, country, city }) => {
          return `${address}, ${city}, ${country}`;
        });
        mapper.addMapper('addresses', 'addresses', mapperAddress);
        const result: UserWithAddressesDto = mapper.transform(userWithAddresses);
        expect(result).toEqual(userWithAddressesDto);
        expect(result.addresses).toEqual(userWithAddressesDto.addresses);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddresses, UserWithAddressesDto>(
          UserAddresses,
          UserWithAddressesDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        const mapperAddress = new Mapper<Address, AddressDto>(Address, AddressDto);
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
        const mapper = new Mapper<UserAddresses, UserWithAddressesWithoutNestingDto>(
          UserAddresses,
          UserWithAddressesWithoutNestingDto,
        );
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

        const result: UserWithAddressesWithoutNestingDto =
          mapper.transform(userWithAddresses);
        expect(result).toEqual(userWithAddressesTwoDto);
        expect(result.addresses).toEqual(userWithAddressesTwoDto.addresses);
      });

      it('Map array', () => {
        const mapper = new Mapper<UserAddress, UserWithAddressWithoutNestingDto>(
          UserAddress,
          UserWithAddressWithoutNestingDto,
        );
        mapper.addMapping('fullName', ({ name, lastName }): string => {
          return `${name} ${lastName}`;
        });
        mapper.addMapping('email', ({ email }): string => {
          return email ?? '';
        });
        mapper.addMapping('address', ({ address }) => {
          return `${address?.address}, ${address?.city}, ${address?.country}`;
        });

        const result: UserWithAddressWithoutNestingDto[] =
          mapper.transform(usersWithAddress);
        expect(result).toEqual(usersWithAddressTwoDto);
        expect(result.length).toBe(1);
        expect(result[0].address).toEqual(userWithAddressTwoDto.address);
      });
    });
  });

  describe('Mapping primitive to object', () => {
    describe('Using functions', () => {
      it('Map object', () => {
        const mapper = new Mapper<UserWithAddressDto, UserAddress>(
          UserWithAddressDto,
          UserAddress,
        );
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
        const mapper = new Mapper<UserWithAddressesDto, UserAddresses>(
          UserWithAddressesDto,
          UserAddresses,
        );
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
        const mapper = new Mapper<UserWithAddressesWithoutNestingDto, UserAddresses>(
          UserWithAddressesWithoutNestingDto,
          UserAddresses,
        );
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
        const mapper = new Mapper<UserWithAddressesWithoutNestingDto, UserAddresses>(
          UserWithAddressesWithoutNestingDto,
          UserAddresses,
        );
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

  describe('Transform to a class object', () => {
    it('Map object', () => {
      const data: Company = {
        id: 1,
        name: 'company 1',
      };
      const mapper = new Mapper<Company, CompanyDto>(Company, CompanyDto);
      mapper.addMapping('name', ({ name }): string => {
        return name ?? '';
      });
      const result = mapper.transform(data);
      expect(result instanceof CompanyDto).toBe(true);
      expect(result.capitalizedName()).toEqual('COMPANY 1');
    });
    it('Map array', () => {
      const data: Company[] = [
        {
          id: 1,
          name: 'company 1',
        },
        {
          id: 2,
          name: 'company 2',
        },
      ];
      const mapper = new Mapper<Company, CompanyDto>(Company, CompanyDto);
      mapper.addMapping('name', ({ name }): string => {
        return name ?? '';
      });
      const result = mapper.transform(data);
      expect(result.length).toBe(2);
      expect(result[0] instanceof CompanyDto).toBe(true);
      expect(result[0].capitalizedName()).toEqual('COMPANY 1');
    });
  });

  describe('Transform to a class object and validate', () => {
    it('Map object', () => {
      const data1: User = {
        name: 'Andres',
        lastName: 'Gutierrez',
        email: 'agutierrezt@unal.edu.co',
      } as User;
      const data: User = {
        name: 'Andres',
        lastName: 'Gutierrez',
        email: 'ag',
      } as User;
      const mapper = new Mapper<User, UserDto>(User, UserDto);
      mapper.addMapping('fullName', ({ name, lastName }): string => {
        return `${name} ${lastName}`;
      });
      mapper.addMapping('email', ({ email }): string => {
        return email ?? '';
      });
      try {
        const result = mapper.transformAndValidate(data1);
        expect(result.fullName).toBe(`${data1.name} ${data1.lastName}`);
        mapper.transformAndValidate(data);
      } catch (e: unknown) {
        expect((e as TransformationError).errors.length).toBe(1);
      }
    });
    it('Map array', () => {
      const data: User[] = [
        {
          name: 'Andres',
          lastName: 'Gutierrez',
          email: 'agutierrezt@slabcode.com',
        } as User,
        {
          name: 'Andres',
          lastName: 'Gutierrez',
          email: 'agutierrezt',
        } as User,
      ];
      const mapper = new Mapper<User, UserDto>(User, UserDto);
      mapper.addMapping('fullName', ({ name, lastName }): string => {
        return `${name} ${lastName}`;
      });
      mapper.addMapping('email', ({ email }): string => {
        return email ?? '';
      });
      try {
        mapper.transformAndValidate(data);
      } catch (e: unknown) {
        expect((e as TransformationError).message).toBe(
          `The validation fail in the position 1`,
        );
      }
    });
  });

  describe('Context when mapping objects', () => {
    it('Map object', () => {
      const address = {
        address: 'Calle falsa 123',
        country: 'Colombia',
        city: 'Bogota',
      };
      const data: UserAddress = {
        name: 'Andres',
        lastName: 'Gutierrez',
        email: 'agutierrezt@slabcode.com',
        address: address,
      } as UserAddress;
      const mapper = new Mapper<UserAddress, UserWithAddressDto>(
        UserAddress,
        UserWithAddressDto,
      );
      mapper.context = {
        separator: '-',
      };
      mapper.addMapping('fullName', ({ name, lastName }): string => {
        return `${name} ${lastName}`;
      });
      mapper.addMapping('email', ({ email }): string => {
        return email ?? '';
      });
      const mapperAddress = new Mapper<Address, AddressDto>(Address, AddressDto);
      mapperAddress.context = {
        addressSeparator: '-',
      };
      mapperAddress.addMapping('address', (data, ctx) => {
        const separator = (ctx?.separator ?? '') + (ctx?.addressSeparator ?? '');
        return `${data.address}${separator}${data.city}${separator}${data.country}`;
      });
      mapper.addMapper('address', 'address', mapperAddress);

      const result = mapper.transform(data);
      const addressResult = mapperAddress.transform(address);
      expect(result.address.address).toBe('Calle falsa 123--Bogota--Colombia');
      expect(addressResult.address).toBe('Calle falsa 123-Bogota-Colombia');
    });

    it('Map array', () => {
      const address = {
        address: 'Calle falsa 123',
        country: 'Colombia',
        city: 'Bogota',
      };
      const data: UserAddress[] = [
        {
          name: 'Andres',
          lastName: 'Gutierrez',
          email: 'agutierrezt@slabcode.com',
          address: address,
        } as UserAddress,
      ];
      const mapper = new Mapper<UserAddress, UserWithAddressDto>(
        UserAddress,
        UserWithAddressDto,
      );
      mapper.context = {
        separator: '-',
      };
      mapper.addMapping('fullName', ({ name, lastName }): string => {
        return `${name} ${lastName}`;
      });
      mapper.addMapping('email', ({ email }): string => {
        return email ?? '';
      });
      const mapperAddress = new Mapper<Address, AddressDto>(Address, AddressDto);
      mapperAddress.context = {
        addressSeparator: '-',
      };
      mapperAddress.addMapping('address', (data, ctx) => {
        const separator = (ctx?.separator ?? '') + (ctx?.addressSeparator ?? '');
        return `${data.address}${separator}${data.city}${separator}${data.country}`;
      });
      mapper.addMapper('address', 'address', mapperAddress);
      const result = mapper.transform(data);
      const addressResult = mapperAddress.transform(address);
      expect(result[0].address.address).toBe('Calle falsa 123--Bogota--Colombia');
      expect(addressResult.address).toBe('Calle falsa 123-Bogota-Colombia');
    });
  });
});
