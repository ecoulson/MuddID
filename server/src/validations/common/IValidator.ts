export default interface IValidator<T> {
    validate(model: T): void;
}
