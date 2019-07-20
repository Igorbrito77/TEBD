import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.regex.Pattern;

public class RDFTransform {

	public static void main(String[] args) {
		try
		 {
			 String path = "E:\\one drive\\OneDrive\\UFRRJCC\\Top.BD\\Trabalho de Web Semântica\\paciente.txt";
			 BufferedReader ler = new BufferedReader(new FileReader(path));
			 path = "E:\\one drive\\OneDrive\\UFRRJCC\\Top.BD\\Trabalho de Web Semântica\\paciente.rdf";
			 BufferedWriter escrever = new BufferedWriter(new FileWriter(path));
			 String RDF = "<rdf:RDF\r\n" + 
			 		"    xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\r\n" + 
			 		"    xmlns:j.0=\"http://ufmedic.com/ufrrj/tebd/#\">\r\n";
			 escrever.append(RDF);
			 String linha;
			 while((linha = ler.readLine())!= null)
			 {
				 geraPaciente(linha,escrever);
			 }
			 escrever.append("</rdf:RDF>");
			 ler.close();
			 escrever.close();
			 path = "E:\\one drive\\OneDrive\\UFRRJCC\\Top.BD\\Trabalho de Web Semântica\\consulta.txt";
			 ler = new BufferedReader(new FileReader(path));
			 path = "E:\\one drive\\OneDrive\\UFRRJCC\\Top.BD\\Trabalho de Web Semântica\\consulta.rdf";
			 escrever = new BufferedWriter(new FileWriter(path));
			 escrever.append(RDF);
			 int id = 0;
			 while((linha = ler.readLine())!= null)
			 {
				 geraConsulta(linha,escrever,id++);
			 }
			 escrever.append("</rdf:RDF>");
			 ler.close();
			 escrever.close();
			 path = "E:\\one drive\\OneDrive\\UFRRJCC\\Top.BD\\Trabalho de Web Semântica\\medico.txt";
			 ler = new BufferedReader(new FileReader(path));
			 path = "E:\\one drive\\OneDrive\\UFRRJCC\\Top.BD\\Trabalho de Web Semântica\\medico.rdf";
			 escrever = new BufferedWriter(new FileWriter(path));
			 escrever.append(RDF);
			 while((linha = ler.readLine())!= null)
			 {
				 geraMedico(linha,escrever);
			 }
			 escrever.append("</rdf:RDF>");
			 ler.close();
			 escrever.close();
		 }
		 catch(Exception e)
		 {
			 
		 }

	}
	
	public static void geraPaciente(String paciente, BufferedWriter escrever)throws IOException
	{
		String[] dados = paciente.split(Pattern.quote("|"));
		String RDF = "\r<rdf:Description rdf:about=\"http://ufmedic.com/ufrrj/tebd/#paciente/"+dados[0]+ "\">\r\n" + 
				"    <j.0:cpf>"+dados[0]+ "</j.0:cpf>\r\n" + 
				"    <j.0:nome>"+dados[1]+ "</j.0:nome>\r\n" + 
				"    <j.0:telefone_contato>"+dados[2]+"</j.0:telefone_contato>\r\n" + 
				"  </rdf:Description>\n";
		escrever.append(RDF + "\n");
	}
	public static void geraConsulta(String consulta, BufferedWriter escrever,int id)throws IOException
	{
		String[] dados = consulta.split(Pattern.quote("|"));
		String RDF = "\r<rdf:Description rdf:about=\"http://ufmedic.com/ufrrj/tebd/#consulta/"+id+ "\">\r\n" +
				"    <j.0:data_hora>"+dados[0]+ "</j.0:data_hora>\r\n" +
				"    <j.0:crm>"+dados[1]+ "</j.0:crm>\r\n" + 
				"    <j.0:cpf>"+dados[2]+"</j.0:cpf>\r\n" + 
				"  </rdf:Description>\n";
		escrever.append(RDF + "\n");
	}
	public static void geraMedico(String medico, BufferedWriter escrever)throws IOException
	{
		String[] dados = medico.split(Pattern.quote("|"));
		String RDF = "\r<rdf:Description rdf:about=\"http://ufmedic.com/ufrrj/tebd/#medico/"+dados[0]+ "\">\r\n" +
				"    <j.0:CRM>"+dados[0]+ "</j.0:CRM>\r\n" +
				"    <j.0:nome>"+dados[1]+ "</j.0:nome>\r\n" +
				"    <j.0:cod_especialidade>"+dados[2]+ "</j.0:cod_especialidade>\r\n" + 
				"    <j.0:ano_formacao>"+dados[3]+"</j.0:ano_formacao>\r\n" + 
				"    <j.0:valor_consulta>"+dados[4]+"</j.0:valor_consulta>\r\n" + 
				"  </rdf:Description>\n";
		escrever.append(RDF + "\n");
	}

}
