"use strict";

$(document).ready(function ($) {
  let $startArr = [
    // Массив работников, чтобы со старта было красиво)
    {
      email: "genius@gmail.com",
      id: 123,
      name: "Tony Stark",
      position: "Iron Man",
      telephone: "+380683055725",
    },
    {
      email: "captain1942@gmail.com",
      id: 456,
      name: "Steven Rogers",
      position: "Captain America",
      telephone: "0683055725",
    },
    {
      email: "alldestroyer@gmail.com",
      id: 789,
      name: "Bruce Banner",
      position: "Hulk",
      telephone: "+0683055725",
    },
  ];

  if (localStorage.workers) {
    // Добавляю данные из localStorage на страницу, если они есть
    printWorkers(JSON.parse(localStorage.workers));
  } else {
    // Если нет, то добавляю данные из заготовленного стартового массива
    printWorkers($startArr);
  }

  //   СОЗДАНИЕ НОВОЙ КАРТОЧКИ СОТРУДНИКА****************************************

  function addNewWorker() {
    let $list = localStorage.workers
      ? JSON.parse(localStorage.workers)
      : $startArr;

    let $data = {};
    $(".form-worker")
      .find("input")
      .each(function () {
        $data[this.name] = $(this).val();
      });
    $data["id"] = Date.now();

    $list.push($data);
    localStorage.workers = JSON.stringify($list);
    $(".form-worker")[0].reset(); 
    printWorkers($list);
  }

  //   ВЫВОД ВСЕГО СПИСКА РАБОТНИКОВ НА СТРАНИЦУ**********************************

  function printWorkers(listArr) {
    $(".worker-list").html("");
    $(listArr).each(function () {
      $(".worker-list").append(
        '<div class="worker-list__card"><div class="worker-list__name">' +
          this.name +
          '</div><div class="worker-list__position">' +
          this.position +
          '</div><div class="worker-list__email">' +
          this.email +
          '</div><div class="worker-list__telephone">' +
          this.telephone +
          '</div><button class="worker-list__btn worker-list__btn_edit" data-id="' +
          this.id +
          '" type="button"><i class="far fa-edit"></i></button><button class="worker-list__btn worker-list__btn_delete" data-id="' +
          this.id +
          '" type="button"><i class="fas fa-trash-alt"></i></button></div>'
      );
    });
  }

  //   РЕДАКТИРОВАНИЕ КАРТОЧКИ СОТРУДНИКА****************************************

  $(document).on("click", ".worker-list__btn_edit", function () {
    $(".worker__button-edit").css("display", "block");
    $(".worker__button-submite").css("display", "none");

    let $btn_edit_id = $(this).data("id");
    let $list = localStorage.workers
      ? JSON.parse(localStorage.workers)
      : $startArr;

    $($list).each(function (index, elem) {
      if (elem.id === $btn_edit_id) {
        $("input[name='name']").val(elem.name);
        $("input[name='position']").val(elem.position);
        $("input[name='email']").val(elem.email);
        $("input[name='telephone']").val(elem.telephone);

        $(".worker__button-edit").attr("data-id", elem.id);
      }
    });
  });

  //СОХРАНИТЬ ОТЕДАКТИРОВАННУЮ КАРТОЧКУ СОТРУДНИКА********************

  function addChangeWorker() {
    event.preventDefault();

    let $idWorker = +$(".worker__button-edit").attr("data-id");

    let $list = localStorage.workers
      ? JSON.parse(localStorage.workers)
      : $startArr;

    $($list).each(function (index, elem) {
      if (elem.id === $idWorker) {
        $list[index] = {
          id: elem.id,
          name: $("input[name='name']").val(),
          position: $("input[name='position']").val(),
          email: $("input[name='email']").val(),
          telephone: $("input[name='telephone']").val(),
        };
      }
    });

    localStorage.workers = JSON.stringify($list);
    printWorkers($list);

    $(".form-worker")[0].reset();
    $(".worker__button-edit").removeAttr("data-id");
    $(".worker__button-edit").css("display", "none");
    $(".worker__button-submite").css("display", "block");
  }

  //   УДАЛЕНИЕ КАРТОЧКИ СОТРУДНИКА****************************************

  $(document).on("click", ".worker-list__btn_delete", function () {
    console.log("+++delete");
    let $btn_edit_id = $(this).data("id");
    let $list = localStorage.workers
      ? JSON.parse(localStorage.workers)
      : $startArr;

    $($list).each(function (index, elem) {
      if (elem.id === $btn_edit_id) {

        $list.splice(index, 1);

        localStorage.workers = JSON.stringify($list);
        printWorkers($list);
      }
    });
  });

  //   ВАЛИДАЦИЯ ФОРМЫ****************************************

  function validatorForm() {
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        if (regexp.constructor != RegExp) regexp = new RegExp(regexp);
        else if (regexp.global) regexp.lastIndex = 0;
        return this.optional(element) || regexp.test(value);
      },
      "Поле “Фамилия Имя” должно содержать два слова, разделенных пробелом"
    );

    $.validator.addMethod(
      "regexPhone",
      function (value, element, regexp) {
        if (regexp.constructor != RegExp) regexp = new RegExp(regexp);
        else if (regexp.global) regexp.lastIndex = 0;
        return this.optional(element) || regexp.test(value);
      },
      "Введите правильный телефон. Пример корректного поля “Телефон”: 0631112233, 80633332211, +380631112233"
    );

    $(".form-worker").validate({
      rules: {
        name: {
          required: true,
          regex: /^[^\s]*\s[^\s][^\s]*$/,
        },
        position: {
          required: true,
          minlength: 5,
        },
        email: {
          required: true,
          email: true,
        },
        telephone: {
          required: true,
          minlength: 10,
          regexPhone: /^(\+)?(\(\d{2,3}\) ?\d|\d)(([ \-]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/,
        },
      },
      messages: {
        name: {
          required: "Это поле обязательно к заполнению",
        },
        position: {
          required: "Это поле обязательно к заполнению",
          minlength: "Поле “Должность” должно содержать минимум 5 символов",
        },
        email: {
          required: "Это поле обязательно к заполнению",
          email:
            "Введите правильный email. Пример корректного поля “Email” - test@gmail.com, test@mysite.com.ua",
        },
        telephone: {
          required: "Это поле обязательно к заполнению",
          minlength: "Поле “Телефон” должно содержать минимум 10 символов",
        },
      },
      submitHandler: function (form) {
        form.submit();
      },
    });
  }

  $(".worker__button-submite").click(function () {
    validatorForm();
    if ($(".form-worker").valid()) {
      console.log("true");
      addNewWorker();
      $(".form-worker").validate().destroy();
    } else {
      console.log("false");
    }
  });

  $(".worker__button-edit").click(function () {
    validatorForm();
    if ($(".form-worker").valid()) {
      console.log("true");
      addChangeWorker();
      $(".form-worker").validate().destroy();
    } else {
      console.log("false");
    }
  });
});
