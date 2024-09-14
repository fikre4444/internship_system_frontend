import ContactComp from "../components/ContactComp";

const Contact = () => {
  return (
    <section className="bg-white">
      <div className="container px-6 py-12 mx-auto">
          <div className="text-center">
              <p className="font-medium text-blue-500">Contact us</p>

              <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl">Get in touch</h1>

              <p className="mt-3 text-gray-500">Our team is available 24/7 to help.</p>
          </div>

          <ContactComp name="Fikre Tesfay" email="fikretesfay4444@gmail.com" phoneNumber="+251939187245" />
          <hr />
          <ContactComp name="Danay Halefom" email="Danay4444@gmail.com" phoneNumber="+25193918732425" />
      </div>
    </section>
  )
}

export default Contact;
