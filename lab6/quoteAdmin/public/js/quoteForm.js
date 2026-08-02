document.addEventListener('DOMContentLoaded', () => {
  document.querySelector("select[name='category']").addEventListener('change', (event) => {
    if (event.target.value == "") {
      document.querySelector("input[name='new_category']").removeAttribute('disabled');
    } else {
      document.querySelector("input[name='new_category']").setAttribute('disabled',true);
    }
  });

  document.querySelector("input[name='new_category']").addEventListener('change', (event) => {
    if (event.target.value != "") {
      document.querySelector("select[name='category']").selectedIndex = 0;
    }
  });
});
