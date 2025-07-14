import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, RotateCcw, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
  gpa: number;
}

const CalculatorPage: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [gradeSystem, setGradeSystem] = useState<'4.0' | '10.0'>('4.0');
  const [cgpa, setCgpa] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  const gradePoints: Record<'4.0' | '10.0', Record<string, number>> = {
    '4.0': {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
    },
    '10.0': {
      'A+': 10, 'A': 9, 'A-': 8, 'B+': 7, 'B': 6, 'B-': 5,
      'C+': 4, 'C': 3, 'C-': 2, 'D': 1, 'F': 0
    }
  };

  useEffect(() => {
    // Calculate CGPA and total credits without updating semesters state to avoid infinite loop
    let totalPoints = 0;
    let totalCreds = 0;

    semesters.forEach(sem => {
      sem.subjects.forEach(subject => {
        const points = gradePoints[gradeSystem][subject.grade] || 0;
        totalPoints += points * subject.credits;
        totalCreds += subject.credits;
      });
    });

    setCgpa(totalCreds > 0 ? totalPoints / totalCreds : 0);
    setTotalCredits(totalCreds);
  }, [semesters, gradeSystem]);

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      subjects: [],
      gpa: 0
    };
    setSemesters([...semesters, newSemester]);
  };

  const deleteSemester = (semesterId: string) => {
    setSemesters(semesters.filter(sem => sem.id !== semesterId));
  };

  const addSubject = (semesterId: string) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      credits: 3,
      grade: 'A'
    };
    
    setSemesters(semesters.map(sem => 
      sem.id === semesterId 
        ? { ...sem, subjects: [...sem.subjects, newSubject] }
        : sem
    ));
  };

  const deleteSubject = (semesterId: string, subjectId: string) => {
    setSemesters(semesters.map(sem => 
      sem.id === semesterId 
        ? { ...sem, subjects: sem.subjects.filter(sub => sub.id !== subjectId) }
        : sem
    ));
  };

  const updateSubject = (semesterId: string, subjectId: string, field: keyof Subject, value: string | number) => {
    setSemesters(semesters.map(sem => 
      sem.id === semesterId 
        ? {
            ...sem, 
            subjects: sem.subjects.map(sub => 
              sub.id === subjectId ? { ...sub, [field]: value } : sub
            )
          }
        : sem
    ));
  };

  const calculateSemesterGPA = (subjects: Subject[]): number => {
    if (subjects.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    subjects.forEach(subject => {
      const points = gradePoints[gradeSystem][subject.grade] || 0;
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCreds = 0;
    
    const updatedSemesters = semesters.map(sem => {
      const gpa = calculateSemesterGPA(sem.subjects);
      return { ...sem, gpa };
    });
    
    setSemesters(updatedSemesters);
    
    updatedSemesters.forEach(sem => {
      sem.subjects.forEach(subject => {
        const points = gradePoints[gradeSystem][subject.grade] || 0;
        totalPoints += points * subject.credits;
        totalCreds += subject.credits;
      });
    });
    
    setCgpa(totalCreds > 0 ? totalPoints / totalCreds : 0);
    setTotalCredits(totalCreds);
  };

  const resetCalculator = () => {
    setSemesters([]);
    setCgpa(0);
    setTotalCredits(0);
  };

  const downloadPDF = async () => {
    const element = document.getElementById('cgpa-results');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save('cgpa-report.pdf');
  };

  const getGradeColor = (gpa: number) => {
    if (gradeSystem === '4.0') {
      if (gpa >= 3.5) return 'text-green-600 dark:text-green-400';
      if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
      if (gpa >= 2.5) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    } else {
      if (gpa >= 8.5) return 'text-green-600 dark:text-green-400';
      if (gpa >= 7.0) return 'text-blue-600 dark:text-blue-400';
      if (gpa >= 5.5) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CGPA Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your Cumulative Grade Point Average with precision and export your results
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-purple-500/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade System:</label>
              <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setGradeSystem('4.0')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    gradeSystem === '4.0'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  4.0 Scale
                </button>
                <button
                  onClick={() => setGradeSystem('10.0')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    gradeSystem === '10.0'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  10.0 Scale
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={addSemester}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span>Add Semester</span>
              </button>
              <button
                onClick={resetCalculator}
                className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all duration-300"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300"
                disabled={semesters.length === 0}
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Semesters */}
          <div className="lg:col-span-2 space-y-6">
            {semesters.length === 0 ? (
              <div className="text-center py-16 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-purple-500/20">
                <GraduationCap className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Semesters Added</h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">Add your first semester to start calculating your CGPA</p>
                <button
                  onClick={addSemester}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Your First Semester</span>
                </button>
              </div>
            ) : (
              semesters.map((semester) => (
                <div key={semester.id} className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-purple-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <input
                        type="text"
                        value={semester.name}
                        onChange={(e) => setSemesters(semesters.map(sem => 
                          sem.id === semester.id ? { ...sem, name: e.target.value } : sem
                        ))}
                        className="text-xl font-semibold bg-transparent border-none focus:outline-none text-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Semester GPA</div>
                        <div className={`text-lg font-bold ${getGradeColor(semester.gpa)}`}>
                          {semester.gpa.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSemester(semester.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {semester.subjects.map((subject) => (
                      <div key={subject.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 dark:bg-slate-700/30 rounded-xl">
                        <input
                          type="text"
                          placeholder="Subject name"
                          value={subject.name}
                          onChange={(e) => updateSubject(semester.id, subject.id, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-800/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Credits"
                          value={subject.credits}
                          onChange={(e) => updateSubject(semester.id, subject.id, 'credits', parseInt(e.target.value) || 0)}
                          className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-800/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                          max="10"
                        />
                        <select
                          value={subject.grade}
                          onChange={(e) => updateSubject(semester.id, subject.id, 'grade', e.target.value)}
                          className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white/70 dark:bg-slate-800/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.keys(gradePoints[gradeSystem]).map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteSubject(semester.id, subject.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all self-center justify-self-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => addSubject(semester.id)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Subject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div id="cgpa-results" className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-purple-500/20">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your CGPA</h3>
                <div className={`text-4xl font-bold mb-2 ${getGradeColor(cgpa)}`}>
                  {cgpa.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Out of {gradeSystem}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-slate-600">
                  <span className="text-gray-600 dark:text-gray-400">Total Semesters</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{semesters.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-slate-600">
                  <span className="text-gray-600 dark:text-gray-400">Total Credits</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{totalCredits}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Grade System</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{gradeSystem}</span>
                </div>
              </div>

              {semesters.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-slate-600">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Semester Breakdown</h4>
                  <div className="space-y-2">
                    {semesters.map((semester) => (
                      <div key={semester.id} className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{semester.name}</span>
                        <span className={`font-semibold ${getGradeColor(semester.gpa)}`}>
                          {semester.gpa.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Grade Scale Reference */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-purple-500/20">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Grade Scale ({gradeSystem})</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(gradePoints[gradeSystem]).map(([grade, points]) => (
                  <div key={grade} className="flex justify-between py-1">
                    <span className="text-gray-600 dark:text-gray-400">{grade}</span>
                    <span className="font-medium text-gray-800 dark:text-white">{points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;