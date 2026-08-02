document.addEventListener('DOMContentLoaded', () => {
  document.querySelector("select[name='category']").addEventListener('change', (event) => {
    if (event.target.value == "") {
      document.querySelector("input[name='new_category']").classList.remove('d-none');
      document.querySelector("#hideNewCategory").classList.add('d-none');
    } else {
      document.querySelector("input[name='new_category']").classList.add('d-none');
      document.querySelector("#hideNewCategory").classList.remove('d-none');
    }
  });

  document.querySelector("input[name='new_category']").addEventListener('change', (event) => {
    if (event.target.value != "") {
      document.querySelector("select[name='category']").selectedIndex = 0;
    }
  });
  document.querySelector("#hideNewCategory").addEventListener('click', (event) => {
    event.target.classList.add('d-none');
    document.querySelector("input[name='new_category']").classList.remove('d-none');
    document.querySelector("select[name='category']").selectedIndex = 0;
  });
});
