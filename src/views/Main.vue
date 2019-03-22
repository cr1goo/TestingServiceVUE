<template>
  <el-card class="box-card" style="min-width: 1000px">

    <div slot="header" class="clearfix">
      <span>Позднов И.В. (студент)</span>
      <div style="float: right; ">
        <el-button type="text" style="padding: 3px 0;" @click="changePassFormForm.show = true">Смена пароля</el-button>
        <el-button type="text" style="padding: 3px 0;">Выход</el-button>
      </div>
    </div>

    <el-radio-group v-model="tests.show">
      <el-radio-button label="available"><i class="el-icon-question"></i> Доступные</el-radio-button>
      <el-radio-button label="completed"><i class="el-icon-success"></i> Завершенные</el-radio-button>
    </el-radio-group>

    <el-dialog title="Смена пароля" :visible.sync="changePassForm.show" width="500px">
      <el-input placeholder="Старый пароль" v-model="changePassForm.old" style="margin-bottom: 10px;"></el-input>
      <el-input placeholder="Новый пароль" v-model="changePassForm.new" style="margin-bottom: 10px;"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePassForm.show = false" icon="el-icon-close">Закрыть</el-button>
        <el-button type="success" icon="el-icon-check">Сохранить</el-button>
      </span>
    </el-dialog>

    <span style="float: right;">
      <el-button type="success" icon="el-icon-plus" @click="newTestForm.isShow = true">Добавить тест</el-button>
      <el-button type="danger" icon="el-icon-delete" style="margin-left: 5px;" disabled>Удалить</el-button>
    </span>

    <el-dialog title="Добавить тест" :visible.sync="newTestForm.isShow" width="500px">
      <el-select v-model="newTestForm.data.discipline" placeholder="Дисциплина" style="margin-bottom: 10px; width: 100%;"></el-select>
      <el-input placeholder="Название" v-model="newTestForm.data.name" style="margin-bottom: 10px; width: 100%;"></el-input>
      <el-input placeholder="Описание" v-model="newTestForm.data.description" style="margin-bottom: 10px; width: 100%;"></el-input>
      <el-select v-model="newTestForm.data.type" placeholder="Тип" style="margin-bottom: 10px; width: 100%;"></el-select>
      <el-date-picker v-model="newTestForm.data.time" type="datetime" placeholder="Время сдачи" style="margin-bottom: 10px; width: 100%;"></el-date-picker>
      <center>
        <el-upload class="upload" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false" :limit="1">
          <el-button slot="trigger" size="small" type="primary">Выберите файл</el-button>
          &nbsp;или <el-button type="warning" size="small" @click="newTestForm.manualInput = true">Добавить вручную</el-button>
          <div class="el-upload__tip" slot="tip">Документ Word размером не более 500 КБ</div>
        </el-upload>
      </center>
      <span slot="footer" class="dialog-footer">
        <center>
          <el-button type="primary" icon="el-icon-search" @click="newTestForm.previewDialog = true">Предпросмотр</el-button>
          <el-button type="success" icon="el-icon-check">Добавить</el-button>
        </center>
      </span>
    </el-dialog>

    <el-dialog title="Ручное добавление" :visible.sync="newTestForm.manualInput" width="800px">
      <el-button type="default" @click="addNewVariant()" style="margin-bottom: 10px;" icon="el-icon-plus">Добавить вариант</el-button>
      <el-tabs type="border-card" v-model="newTestForm.activeVariant" closable @tab-remove="delVariant">
        <el-tab-pane v-for="(variant, varid) in newTestForm.data.tests" :key="varid" :label="'Вариант '+(varid+1)"> 
          <el-button type="success" size="small" icon="el-icon-plus" @click="addNewQuestion(variant.questions)" style="margin-bottom: 10px;">Добавить вопрос</el-button>
          <el-collapse accordion v-for="(question, questid) in variant.questions" :key="questid">
            <el-collapse-item>
              <template slot="title">
                <el-button type="danger" size="small" icon="el-icon-delete" @click="delQuestion(newTestForm.activeVariant, questid)"/>&nbsp;
                {{ 'Вопрос '+(questid+1)+' ('+question.title+')' }}
              </template>
              <el-input v-model="question.title" style="margin-bottom: 10px;" placeholder="Содержание вопроса"/>
              <template v-for="(answer, ansid) in question.answers">
                <el-input v-model="question.answers[ansid].value" :key="ansid" style="margin-bottom: 10px; width: 100%" placeholder="Содержание ответа"> 
                  <template slot="prepend"><el-checkbox v-model="answer.correct" :key="ansid"/></template>
                  <template slot="append"><el-button type="danger" size="medium" icon="el-icon-delete" @click="delAnswer(newTestForm.activeVariant, questid, ansid)" :key="ansid"/></template>
                </el-input>
              </template>
              <el-button type="warning" size="medium" @click="addNewAnswer(question.answers)" style="margin-bottom: 10px;" icon="el-icon-plus">Добавить ответ</el-button>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="newTestForm.manualInput = false" icon="el-icon-check">Сохранить</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Предпросмотр" :visible.sync="newTestForm.previewDialog" width="800px">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(variant, varid) in newTestForm.data.tests" :key="varid" :label="'Вариант '+(varid+1)"> 
          <div v-for="(question, questid) in variant.questions" :key="questid" style="margin-bottom: 10px; border-bottom: 1px dashed #DCDFE6; padding-bottom: 10px;">
            <div>
              <b>{{ 'Вопрос '+(questid+1)+'. '+question.title }}</b>
              <div v-for="(answer, ansid) in question.answers" :key="ansid">
                  {{ (ansid+1)+'. '+question.answers[ansid].value}} 
              </div>
              <div>
              Верный(е) ответ(ы):
              <span v-for="(answer, ansid) in question.answers" :key="ansid">
                <b v-if="question.answers[ansid].correct">
                  {{ (ansid+1) }} 
                </b>
              </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <div v-if="tests.show == 'available'" style="margin-top: 10px;">
      <el-table border :data="store.tests.available" style="width: 100%">
        <el-table-column prop="id" label="#" width="40px"></el-table-column>
        <el-table-column prop="discipline" label="Дисциплина"></el-table-column>
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="type" label="Тип" width="100px"></el-table-column>
        <el-table-column prop="time" label="Сдать до" width="95px"></el-table-column>
        <el-table-column prop="num" label="Кол-во вопросов" width="145px"></el-table-column>
        <el-table-column fixed="right" label="Выбор" width="70px">
          <el-checkbox label=""></el-checkbox>
          <el-button type="text" size="small" icon="el-icon-edit"></el-button>
        </el-table-column>
      </el-table>
    </div>
    
    <div v-if="tests.show == 'completed'" style="margin-top: 10px;">
      <el-table border :data="tests.completed" style="width: 100%">
        <el-table-column prop="id" label="#" width="40px"></el-table-column>
        <el-table-column prop="discipline" label="Дисциплина"></el-table-column>
        <el-table-column prop="name" label="Название"></el-table-column>
        <el-table-column prop="type" label="Тип" width="100px"></el-table-column>
        <el-table-column prop="date" label="Дата" width="95px"></el-table-column>
        <el-table-column prop="num" label="Кол-во вопросов" width="145px"></el-table-column>
        <el-table-column prop="plus" label="Верных ответов" width="145px"></el-table-column>
        <el-table-column prop="mark" label="Оценка" width="85px"></el-table-column> 
      </el-table>
    </div>
  </el-card>
</template>

<style>
  .el-collapse-item__header {
    border-bottom: 0;
  }
</style>


<script>
export default {
  data() {
    return {
      store: {
        loggedUser: this.$store.getters.loggedUser,
        tests: this.$store.getters.tests
      },

      newTestForm: {
        isShow: false,
        manualInput: false,
        previewDialog: false,
        activeVariant: "0",
        data: {
          discipline: "",
          name: "",
          description: "",
          type: "",
          time: "",
          tests: [
            {
              questions: []
            },
          ],
        }
      },

      changePassForm: {
        show: false,
        password: {
          old: "",
          new: ""
        }
      },

      tests: {
        show: "available",
        delete: [],
      },
    }
  },

methods: {
    addNewVariant() {
      this.newTestForm.data.tests.push({
        questions: []
      })
    },

    addNewQuestion(questions){
      questions.push({
        title: 'Новый вопрос',
        answers: [],
      })
    },

    addNewAnswer(answers) {
      answers.push({
        value: '',
        correct: false  
      })
    },

      delVariant(variant) {
        let tabs = this.newTestForm.data.tests;
        let activeName = this.newTestForm.activeVariant;
        if (activeName === variant) {
          tabs.forEach((tab, index) => {
            if (tab.name === variant) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.newTestForm.activeVariant = activeName;
        this.newTestForm.data.tests = tabs.filter(tab => tab.name !== variant);
      },

    delQuestion(variant, question) {
      this.newTestForm.data.tests[variant].questions.splice(question, 1)
    },

    delAnswer(variant, question, answer) {
      this.newTestForm.data.tests[variant].questions[question].answers.splice(answer, 1)
    }
  }
}

</script>

