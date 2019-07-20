#MANUAL

O trabalho de web semântica consiste em realizar um sistema que apresenta a grade de horários de atendimento de médicos informando os dados dos médicos, utilizando triplas RDF, consultas em linguagem SPARQL e banco de dados de triplas a partir de uma base de dados inicialmente fornecida e um modelo relacional.


##PREPARAÇÃO

	Inicialmente a base de dados foi tratada para contemplar o formato RDF e para isto foi desenvolvida uma solução na linguagem Java onde, a partir do conjunto de dados recebido, gera quatro arquivos RDF: consulta.rdf, medico.rdf, especialidade.rdf e paciente.rdf. A conversão é feita através do tratamento no texto do arquivo recebido.
	Utilizando o servidor Apache Jena Fuseki (versão 3.12), foram criados 4 datasets de forma manual sendo um para cada arquivo RDF onde estes foram importados após a criação.



##DESENVOLVIMENTO

	Para o desenvolvimento foi utilizado uma página html representado por index.html para apresentação no navegador que utiliza scripts na linguagem JavaScript representado em funcoes.js. O dinamismo da aplicação está contido no arquivo JavaScript que é responsável pela apresentação do conteúdo dinâmico através da comunicação com o servidor Apache Jena Fuseki onde realiza as consultas em SPARQL e exibe as informações do médico e sua grade de acordo com o nome do médico dado sua especialidade. 



##EXECUÇÃO

	Para executar o código é necessário iniciar o arquivo apache-jena-fuseki-3.12.0\fuseki-server.bat onde iniciará o servidor Apache Jena Fuseki na porta 3030 do localhost, logo após deve-se executar o arquivo index.html que abrirá o navegador padrão com o sistema pronto.
