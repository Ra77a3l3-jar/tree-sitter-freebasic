from setuptools import setup, Extension
from setuptools.command.build import build
from wheel.bdist_wheel import bdist_wheel
import platform


class Build(build):
    def run(self):
        if self.distribution.ext_modules:
            self.run_command("build_ext")
        build.run(self)


class BdistWheel(bdist_wheel):
    def get_tag(self):
        python, abi, platform = bdist_wheel.get_tag(self)
        if python.startswith("cp"):
            python, abi = "cp38", "abi3"
        return python, abi, platform


setup(
    packages=["tree_sitter_freebasic"],
    package_dir={"": "bindings/python"},
    package_data={
        "tree_sitter_freebasic": ["*.pyi", "py.typed"],
    },
    ext_package="tree_sitter_freebasic",
    ext_modules=[
        Extension(
            name="_binding",
            sources=[
                "bindings/python/tree_sitter_freebasic/binding.c",
                "src/parser.c",
            ],
            extra_compile_args=["-std=c99"] if platform.system() != "Windows" else [],
            define_macros=[
                ("Py_LIMITED_API", "0x03080000"),
                ("PY_SSIZE_T_CLEAN", None)
            ],
            include_dirs=["src"],
            py_limited_api=True,
        )
    ],
    cmdclass={
        "build": Build,
        "bdist_wheel": BdistWheel
    },
    zip_safe=False
)
