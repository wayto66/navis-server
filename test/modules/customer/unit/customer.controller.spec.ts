import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from 'src/modules/customer/customer.controller';
import { CustomerService } from 'src/modules/customer/customer.service';
import { CreateCustomerDto } from 'src/modules/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customer/dto/update-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;

  const mockCustomerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer and return it', async () => {
      const dto: CreateCustomerDto = { name: 'New Customer' };
      const createdCustomer = { id: 1, ...dto };
      mockCustomerService.create.mockResolvedValue(createdCustomer);

      const result = await controller.create(dto);
      expect(result).toEqual(createdCustomer);
      expect(mockCustomerService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [
        { id: 1, name: 'Customer 1' },
        { id: 2, name: 'Customer 2' },
      ];
      mockCustomerService.findAll.mockResolvedValue(customers);

      const result = await controller.findAll();
      expect(result).toEqual(customers);
      expect(mockCustomerService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const customer = { id: 1, name: 'Customer 1' };
      mockCustomerService.findOne.mockResolvedValue(customer);

      const result = await controller.findOne(1);
      expect(result).toEqual(customer);
      expect(mockCustomerService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a customer by ID and return it', async () => {
      const updateDto: UpdateCustomerDto = { name: 'Updated Customer' };
      const updatedCustomer = { id: 1, ...updateDto };
      mockCustomerService.update.mockResolvedValue(updatedCustomer);

      const result = await controller.update(1, updateDto);
      expect(result).toEqual(updatedCustomer);
      expect(mockCustomerService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a customer by ID', async () => {
      const customer = { id: 1, name: 'Customer to be removed' };
      mockCustomerService.remove.mockResolvedValue(customer);

      const result = await controller.remove(1);
      expect(result).toEqual(customer);
      expect(mockCustomerService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should return customers by name search', async () => {
      const customers = [{ id: 1, name: 'Matching Customer' }];
      mockCustomerService.search.mockResolvedValue(customers);

      const result = await controller.search('Matching');
      expect(result).toEqual(customers);
      expect(mockCustomerService.search).toHaveBeenCalledWith('Matching');
    });
  });
});
