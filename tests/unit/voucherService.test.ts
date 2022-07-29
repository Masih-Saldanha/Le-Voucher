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
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => { return true });

    const voucher = voucherServiceFactory.createVoucher();

    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(voucherRepository.getVoucherByCode).toBeCalled();
    expect(voucherService.createVoucher).toThrow()
  });
});