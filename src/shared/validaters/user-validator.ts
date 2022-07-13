import { BadRequestException } from '@nestjs/common';
import { UserRoles } from '../../types/roles';

export class UserValidator {
  async userPhone(phone: string) {
    try {
      for (let i = 0; i < phone.length; ++i) {
        if (
          (phone[i] >= 'a' && phone[i] <= 'z') ||
          (phone[i] >= 'A' && phone[i] <= 'Z')
        ) {
          throw new BadRequestException('Letter used in phone number!!!');
        }
      }
      if (phone[0] === '0') {
        if (phone.length === 9) {
          return phone;
        }
        throw new BadRequestException('Phone number is not exist!!!1');
      } else if (
        phone[0] === '3' &&
        phone[1] === '7' &&
        phone[2] === '4' &&
        phone[3] !== '0'
      ) {
        if (phone.length === 11) {
          return phone;
        }
        throw new BadRequestException('Phone number is not exist!!!2');
      } else {
        throw new BadRequestException('Phone number is not exist!!!3');
      }
    } catch (error) {
      throw error;
    }
  }
  userEmail(email: string) {
    try {
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (email.match(validRegex)) {
        return email;
      } else {
        throw new BadRequestException('Invalid email address!!!');
      }
    } catch (error) {
      throw error;
    }
  }
  async roleValidator(role: any) {
    const roles = ['driver', 'superAdmin', 'client', 'staff'];

    for (let i = 0; i < roles.length; ++i) {
      if (role === roles[i]) {
        return i + 1;
      }
    }
  }
}
