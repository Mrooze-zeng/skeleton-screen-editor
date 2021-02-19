function Form({
  children,
  onSubmit = function (e) {},
  onReset = function (e) {},
}) {
  const _handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const data = Object.fromEntries(formdata.entries());
    const checkboxs = e.target.querySelectorAll('[type="checkbox"]');
    const checkboxSet = new Set();
    Array.prototype.forEach.call(checkboxs, (checkbox) => {
      checkboxSet.add(checkbox.name);
    });
    checkboxSet.forEach((checkbox) => {
      data[checkbox] = formdata.getAll(checkbox);
    });
    e.data = data;
    onSubmit(e);
  };
  return (
    <form onSubmit={_handleSubmit} onReset={onReset}>
      {children}
    </form>
  );
}

export default Form;
