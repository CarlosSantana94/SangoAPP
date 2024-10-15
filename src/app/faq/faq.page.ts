import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  expandedIndex: number | null = null;

  faqs = [
    {
      question: '¿Cómo programo una recolección de prendas?',
      answer: 'Puedes programar una recolección a través de la app seleccionando el servicio y la fecha de tu conveniencia.',
    },
    {
      question: '¿Cuáles son los servicios disponibles?',
      answer: 'Ofrecemos servicios de Tintorería, Planchado, Lavandería, Blancos y Hogar, y Teñidos.',
    },
    {
      question: '¿Cómo sé cuándo mis prendas están listas?',
      answer: 'Te notificaremos a través de la app cuando tus prendas estén listas para entrega.',
    },
    {
      question: '¿Cuál es el costo de recolección y entrega?',
      answer: 'El costo de recolección y entrega depende de tu ubicación y el tamaño de la orden. Lo verás antes de confirmar.',
    },
    {
      question: '¿Qué tipo de prendas puedo enviar?',
      answer: 'Puedes enviar ropa de uso diario, ropa de cama, prendas delicadas, y más. Si tienes dudas sobre una prenda específica, consulta con nosotros.',
    },
    {
      question: '¿Cuáles son los horarios de recolección y entrega?',
      answer: 'Ofrecemos recolección y entrega de lunes a sábado, entre las 8:00 a.m. y las 6:00 p.m. Puedes elegir el horario que mejor te convenga desde la app.',
    },
    {
      question: '¿Qué sucede si no estoy en casa cuando pasan a recoger o entregar las prendas?',
      answer: 'Si no estás disponible, podrás reprogramar la recolección o entrega sin costo adicional dentro de las próximas 24 horas.',
    },
    {
      question: '¿Cómo debo empacar las prendas para la recolección?',
      answer: 'Puedes empacar tus prendas en una bolsa o caja de tu preferencia. Si tienes prendas delicadas o que requieren un tratamiento especial, por favor indícalo en la app.',
    },
    {
      question: '¿Qué tipo de productos utilizan para la limpieza?',
      answer: 'Utilizamos productos de alta calidad y ecológicos para garantizar el mejor cuidado de tus prendas y el menor impacto ambiental.',
    },
    {
      question: '¿Cómo puedo pagar el servicio?',
      answer: 'Aceptamos pagos a través de tarjetas de crédito, débito, PayPal y otras plataformas de pago en línea directamente en la app. El pago se realiza al momento de confirmar la orden.',
    },
    {
      question: '¿Cómo puedo ver el estado de mi orden?',
      answer: 'Puedes seguir el estado de tu orden en tiempo real desde la app. Recibirás notificaciones cuando la recolección y la entrega estén en camino.',
    },
    {
      question: '¿Ofrecen algún tipo de garantía sobre el servicio?',
      answer: 'Garantizamos la calidad de nuestros servicios. Si no quedas satisfecho con el resultado, contáctanos dentro de las primeras 24 horas para que podamos revisarlo y encontrar una solución.',
    },
    {
      question: '¿Qué debo hacer si una prenda se daña o se pierde?',
      answer: 'Si una prenda sufre daños o se pierde durante el proceso de limpieza, trabajaremos contigo para resolver el problema y compensarte adecuadamente según el valor de la prenda.',
    },
    {
      question: '¿Hay un pedido mínimo para solicitar el servicio?',
      answer: 'No tenemos un pedido mínimo, pero los costos de recolección pueden variar dependiendo de la cantidad de prendas.',
    },
    {
      question: '¿Cómo puedo cancelar o modificar mi pedido?',
      answer: 'Puedes cancelar o modificar tu pedido desde la app hasta 2 horas antes del horario programado para la recolección sin costo adicional.',
    },
    {
      question: '¿Ofrecen algún tipo de descuento o programa de fidelidad?',
      answer: 'Sí, ofrecemos descuentos en tus primeras órdenes y programas de fidelidad que te permiten acumular puntos para canjear por descuentos en servicios futuros.',
    },
    {
      question: '¿Cuánto tiempo tardan en entregar mis prendas?',
      answer: 'El tiempo de entrega varía según el servicio. Generalmente, el servicio estándar de tintorería y lavandería tarda entre 24 y 48 horas. Puedes verificar el tiempo estimado de cada servicio antes de confirmar tu pedido.',
    },
    {
      question: '¿Puedo solicitar un servicio urgente?',
      answer: 'Sí, ofrecemos un servicio exprés para aquellos que necesiten que sus prendas sean entregadas en un plazo de 24 horas. Este servicio tiene un costo adicional.',
    },
    {
      question: '¿Cómo me aseguro de que mis prendas delicadas reciban el tratamiento adecuado?',
      answer: 'Puedes especificar los detalles de cuidado especial para prendas delicadas cuando hagas tu pedido. Nuestro equipo tiene experiencia en el manejo de tejidos delicados y garantizará su cuidado.',
    },
    {
      question: '¿Ofrecen servicios de reparación de prendas?',
      answer: 'Sí, ofrecemos servicios de reparación menores como costura de botones o arreglos básicos. Puedes agregar esta opción a tu pedido desde la app.',
    }
  ];


  constructor() { }

  ngOnInit() {
  }

  toggleAnswer(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = null; // Si ya está expandido, lo colapsa
    } else {
      this.expandedIndex = index; // Expande la respuesta seleccionada
    }
  }

}
