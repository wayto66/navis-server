import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CustomerService } from 'src/modules/customer/customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  const mockPrismaService = {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const dto = { name: 'New Customer' };
      mockPrismaService.customer.create.mockResolvedValue(dto);

      const result = await service.create(dto as any);
      expect(result).toEqual(dto);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [{ name: 'Customer 1' }, { name: 'Customer 2' }];
      mockPrismaService.customer.findMany.mockResolvedValue(customers);

      const result = await service.findAll();
      expect(result).toEqual(customers);
      expect(prisma.customer.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const customer = { id: 1, name: 'Customer 1' };
      mockPrismaService.customer.findUnique.mockResolvedValue(customer);

      const result = await service.findOne(1);
      expect(result).toEqual(customer);
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer by ID', async () => {
      const updateDto = { name: 'Updated Customer' };
      const updatedCustomer = { id: 1, ...updateDto };
      mockPrismaService.customer.findUnique.mockResolvedValue(updatedCustomer);
      mockPrismaService.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(1, updateDto as any);
      expect(result).toEqual(updatedCustomer);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if customer to update not found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.update(1, { name: 'Updated Customer' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a customer by ID', async () => {
      const customer = { id: 1, name: 'Customer to be deleted' };
      mockPrismaService.customer.findUnique.mockResolvedValue(customer);
      mockPrismaService.customer.delete.mockResolvedValue(customer);

      const result = await service.remove(1);
      expect(result).toEqual(customer);
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if customer to delete not found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should search and return customers by name', async () => {
      const customers = [{ id: 1, name: 'Matching Customer' }];
      mockPrismaService.customer.findMany.mockResolvedValue(customers);

      const result = await service.search('Matching');
      expect(result).toEqual(customers);
      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'Matching',
            mode: 'insensitive',
          },
        },
      });
    });
  });
});
