import { faker } from '@faker-js/faker';

export function generateTestUser() {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  return {
    firstname,
    lastname,
    userName: `${firstname}_${lastname}`,
    password: 'T3st@123',
  };
}