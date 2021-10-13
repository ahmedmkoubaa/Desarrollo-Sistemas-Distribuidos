/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import org.apache.thrift.server.TServer;
import org.apache.thrift.server.TServer.Args;
import org.apache.thrift.server.TSimpleServer;
import org.apache.thrift.server.TThreadPoolServer;
import org.apache.thrift.transport.TSSLTransportFactory;
import org.apache.thrift.transport.TServerSocket;
import org.apache.thrift.transport.TServerTransport;



public class Server {

  public static Handler handler;

  public static Calculadora.Processor processor;

  public static void main(String [] args) {
    try {
      handler = new Handler();
      processor = new Calculadora.Processor(handler);

      TServerTransport serverTransport = new TServerSocket(9091);
      TServer server = new TSimpleServer(new Args(serverTransport).processor(processor));

      System.out.println("Arrancando servidor ... ");
      server.serve();
      
    } catch (Exception x) {
      x.printStackTrace();
    }
  }
}