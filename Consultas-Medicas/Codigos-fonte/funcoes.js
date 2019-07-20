var vetorEspecialidade= [];

const vetor_horas = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const vetor_dias = ["Segunda","Terça","Quarta","Quinta","Sexta"];
const dicionario_dias = {"Mon" : 0, "Tue" : 1, "Wed" : 2, "Thu" : 3, "Fri" : 4};
const dicionario_horas = {"8" : 0, "9": 1, "10": 2, "11" : 3, "12" : 4, "13": 5, "14": 6, "15" : 7, "16" : 8, "17": 9, "18": 10, "19" : 11};

//Quando a página html é aberta, a listagem das especialidades médicas disponíveis é feita 
$(document).ready(function() {

  desenha_tabela_horarios();
  var consulta_especialidades =
  'query= PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
  'PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#> '+
  'SELECT ?subject ?predicate ?object ?codigo '+
  'WHERE {  '+
  '?subject j.0:nome ?object. '+
  '?subject j.0:codigo ?codigo }'
  listarEspecialidades(consulta_especialidades);
});

//Ao selecionar uma opção de especialidade, os médicos que apresentam a determinada especialidade são disponibilizados.
$(document).ready(function() {

        desenha_tabela_html();

        $('#lista-especialidade').change(function() {
      
          var nome_especialidade = $('#lista-especialidade').val();
          var id_especialidade;
          vetorEspecialidade.forEach(element => {
            if (element.nome == nome_especialidade){
              id_especialidade = element.id;
            }            
          });
        
            var consulta_medicos = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>'+
            'PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#>'+
            'SELECT ?subject ?predicate ?object ' +
            'WHERE { '+
            '?subject j.0:cod_especialidade "'+ id_especialidade +'" . '+
            '?subject j.0:nome  ?object }';

            listarMedicos(consulta_medicos);

      });
});
      
$(document).ready(function() {
        $('#lista-medico').change(function() {    //Ao selecionar o nome de um médico, seus dados são impressos na tela

          var consulta_info_medico = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#> '+
          'SELECT ?subject ?predicate ?crm ?valor ?ano '+
          'WHERE {'+
          ' ?subject j.0:nome "'+ $('#lista-medico').val() +'" .'+
            ' ?subject j.0:CRM ?crm. '+
            ' ?subject j.0:valor_consulta ?valor. '+
            ' ?subject j.0:ano_formacao ?ano '+
          ' }';
    
          imprimeMedico(consulta_info_medico);
        });
});

 
async function listarEspecialidades(consulta_especialidades) {
    
    try{
      
      let resultado = await fetch('http://localhost:3030/especialidade/sparql', {  //executa a consulta no banco Fuseki
                method: 'post',
                headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
                body: consulta_especialidades
      });

      let result = await resultado.json();
     
      result.results.bindings.forEach(element => {
            $('#lista-especialidade').append(
                '<option>' + element.object.value + '</option>');
              
              var especialidade = {"nome":"id"};
              especialidade.nome = element.object.value;
              especialidade.id = element.codigo.value;
              vetorEspecialidade.push(especialidade);
      });
     
    }
    catch(err){
      console.log("Erro interno")
    }
}

    
async function listarMedicos(consulta_medicos){

  try{

      let resultado = await fetch('http://localhost:3030/medico/sparql', {
        method: 'post',
        headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
        body: consulta_medicos
       });

      let result = await resultado.json();
    
      reseta_dados(); //atualiza as options com os nomes dos médicos vindos do resultado da consulta    
      result.results.bindings.forEach(element => {
        $('#lista-medico').append('<option>' + element.object.value + '</option>');
      });          
  }
  catch(err){
      console.log("Erro interno ")
  }

}



async function imprimeMedico(consulta_info_medico){
    
    try{

  
          let crm; 

          let resultado =  await fetch('http://localhost:3030/medico/sparql', {
              method: 'post',
              headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
              body: consulta_info_medico
              });

            let result = await resultado.json();
          
            desenha_tabela_medico();
            
            result.results.bindings.forEach(element => {

                      crm =  element.crm.value;        
              
                      $("#id-tr").append(
                        "<td>"+  $('#lista-medico').val() + "</td>"+
                        "<td>"+  element.crm.value + "</td>"+
                        "<td>"+  'R$' + element.valor.value+ '.00' + "</td>"+
                        "<td>"+  element.ano.value+ "</td>"+
                        "<td>"+ $('#lista-especialidade').val()+ "</td>"+
                        "</tr></table>"
                      );
            });            

              ///consulta de horários do médico selecionado
              var consulta_horarios_medico = 'query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX j.0: <http://ufmedic.com/ufrrj/tebd/#>'+
              ' SELECT ?subject ?predicate ?object' +
              ' WHERE { '+
              ' ?subject j.0:crm "' + crm+ '" . '+
              ' ?subject j.0:data_hora ?object }';

          
              let resultado_horario = await fetch('http://localhost:3030/consulta/sparql', {
                  method: 'post',
                  headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
                  body: consulta_horarios_medico
                });
              
              let result_horario = await resultado_horario.json();
               
              
              desenha_tabela_horarios();
              
              result_horario.results.bindings.forEach(element => {
                        
                        var d = new Date(element.object.value);
                        let dia = d.toDateString().substring(0,3); //Converte e extrai o dia da semana da data retornada
                        let hora = d.getHours();                   // //Converte e extrai a hora da data retornada

                        let i = dicionario_dias[dia];
                        let j = dicionario_horas[hora];
                        $('#' + j + '' + i).html('X');  //Marca os dias e horários não disponíveis do médico na tabela de horários
              
              });
    }
    catch(err){
      console.log("Erro iterno");
    }
}

//Funções para front-end
function reseta_dados(){

  $('#lista-medico').empty();
  $('#lista-medico').append('<option>--</option>');
  desenha_tabela_medico();
  desenha_tabela_horarios();
}


function desenha_tabela_medico(){
  
  $("#tabela-medico").empty();
  $("#tabela-medico").append('<table class="table table-bordered"><tr><th>Nome</th> <th>CRM</th><th>Valor da Consulta</th><th>Ano de formação</th>'
  + '<th>Especialidade</th></tr> <tr id = "id-tr">');

}


function desenha_tabela_html(){
  $("#tabela-medico").append('<table id="tabela-medico" style="width:100%;height:100%" class="table table-bordered"><tr><th>Nome</th> <th>CRM</th><th>Valor da Consulta</th>'
  +'<th>Ano de formação</th><th>Especialidade</th></tr>'
  +'</table>');
}


function desenha_tabela_horarios(){
  $("#tabela-horario").empty();

  var string_agenda = '<table id = "tabela-horario" style="width: 50%" class="table table-bordered">';
  string_agenda+= '<th></th>'
  for(var i = 0; i < vetor_dias.length; i++)  
    string_agenda += '<th id=' + i + '>' + vetor_dias[i] + '</th>'
    
  
  for(var i = 0; i < vetor_horas.length; i++){
    
    string_agenda += '<tr><td id = "' + (0+ '' +i) + '">' + vetor_horas[i]+ '</td>'

    for(var j = 0; j < vetor_dias.length; j++){
      string_agenda += '<td id = "' + i +''+ j + '"></td>'
    }
    string_agenda+= '</tr>'
  }

  string_agenda += '</table>'
  $("#tabela-horario").append(string_agenda);
}
