import Exception from "../../models/common/exceptions/Exception";

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeSameException(expectedException: Exception | Error | undefined | null): R;
		}
	}
}
