import { jest } from "@jest/globals";

import voucherRepository from "../../src/repositories/voucherRepository.js";
import voucherServiceFactory from "../factories/voucherServiceFactory.js";
import voucherService from "../../src/services/voucherService.js";

describe("voucherService test suite", () => {
  it("should create a voucher", async () => {
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { });
    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { });

    const voucher = voucherServiceFactory.createVoucher();

    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(voucherRepository.getVoucherByCode).toBeCalled();
    expect(voucherRepository.createVoucher).toBeCalled();
  });

  it("should not create a repeated voucher", async () => {
    const voucher = voucherServiceFactory.createVoucher();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return voucher
    });

    const promise = voucherService.createVoucher(voucher.code, voucher.discount);

    expect(promise).rejects.toEqual({ message: "Voucher already exist.", type: "conflict" });
  });

  it("should apply discount on voucher", async () => {
    const amount = 1000;
    const voucher = voucherServiceFactory.createVoucher();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return { ...voucher, used: false };
    });
    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => {
      return { ...voucher, used: true };
    });

    const promise = await voucherService.applyVoucher(voucher.code, amount);

    expect(promise.amount).toBe(amount);
    expect(promise.discount).toBe(voucher.discount);
    expect(promise.finalAmount).toBe((amount - (amount * (voucher.discount / 100))));
  });

  it("should not apply discount on voucher for values below 100", async () => {
    const amount = 50;
    const voucher = voucherServiceFactory.createVoucher();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return { ...voucher, used: false };
    });
    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => {
      return { ...voucher, used: true };
    });

    const promise = await voucherService.applyVoucher(voucher.code, amount);

    expect(promise.amount).toBe(amount);
    expect(promise.discount).toBe(voucher.discount);
    expect(promise.finalAmount).toBe((amount));
  });

  it("should not apply discount on used voucher", async () => {
    const amount = 1000;
    const voucher = voucherServiceFactory.createVoucher();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return { ...voucher, used: true };
    });

    const promise = await voucherService.applyVoucher(voucher.code, amount);

    expect(promise.amount).toBe(amount);
    expect(promise.discount).toBe(voucher.discount);
    expect(promise.finalAmount).toBe((amount));
    expect(promise.applied).toBe(false);
  });

  it("should not apply discount on invalid voucher", async () => {
    const amount = 1000;
    const voucher = voucherServiceFactory.createVoucher();

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { return false });

    const promise = voucherService.applyVoucher(voucher.code, amount);

    expect(promise).rejects.toEqual({ message: "Voucher does not exist.", type: "conflict" });
  });
});